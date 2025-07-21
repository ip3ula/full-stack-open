const JWT = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments({}),
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args) => {
      const { genre, author } = args

      if (!genre && !author) {
        return await Book.find({}).populate('author')
      }

      if (genre && author) {
        const foundAuthor = await Author.findOne({ name: author })
        if (!foundAuthor) return []
        return await Book.find({
          author: foundAuthor._id,
          genres: genre,
        }).populate('author')
      }

      if (genre) {
        return await Book.find({
          genres: genre,
        }).populate('author')
      }

      if (author) {
        const foundAuthor = await Author.findOne({ name: author })
        if (!foundAuthor) return []
        return await Book.find({ author: foundAuthor._id }).populate('author')
      }
    },

    allAuthors: async () => {
      try {
        const authors = await Author.find({}).populate('books')
        return await Promise.all(
          authors.map(async (author) => {
            const bookCount = author.books?.length
            return { ...author.toObject(), bookCount }
          })
        )
      } catch (err) {
        console.error('❌ allAuthors resolver error:', err)
        throw new GraphQLError('Error in allAuthors resolver', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        })
      }
    },

    me: async (root, args, context) => {
      return context.currentUser || null
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
      }

      // Optional: Avoid duplicate title+author
      const existingBook = await Book.findOne({ title: args.title, author: author._id })
      if (existingBook) {
        return await existingBook.populate('author')
      }

      const newBook = new Book({
        ...args,
        author: author._id,
      })

      let book
      try {
        book = await newBook.save()
        author.books.push(newBook._id)
        await author.save()

      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }

      const populatedBook = await book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
      return populatedBook
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const { name, setBornTo } = args
      const author = await Author.findOne({ name })
      if (!author) {
        return null
      }

      author.born = setBornTo
      return await author.save()
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = args.password === 'secret' // simple hardcoded check

      if (!user || !passwordCorrect) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: JWT.sign(userForToken, process.env.JWT_SECRET),
      }
    },

    editGenre: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('unauthorized action', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      currentUser.favoriteGenre = args.genre

      try {
        return await currentUser.save()
      } catch (err) {
        throw new GraphQLError('Updating user favorite genre failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.genre,
            error: err,
          },
        })
      }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
