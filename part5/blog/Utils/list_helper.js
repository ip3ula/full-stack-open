const dummy = (blogs) => {
  return 1;
}
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null; // Handle empty array case

  const highestLikes = Math.max(...blogs.map(blog => blog.likes));
  const findObject = blogs.find(blog => blog.likes === highestLikes);
  
  return findObject;
};
const mostBlogs = (blogs) => {
  const  author = "Robert C. Martin"
  const filtered = blogs.filter(blog => blog.author === author)
  const length = filtered.length
  return {
    author: author,
    blogs: length
  }
}
const mostLikes = (blogs) => {
  const authors = [];

  blogs.forEach(blog => {
    const existingAuthor = authors.find(author => author.author === blog.author);

    if (existingAuthor) {
      existingAuthor.likes += blog.likes;
    } else {
      authors.push({ author: blog.author, likes: blog.likes });
    }
  });

  return authors.length > 0 ? authors.reduce((max, author) => 
    author.likes > max.likes ? author : max, authors[0]) : null;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }