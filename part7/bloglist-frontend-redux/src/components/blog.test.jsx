import { test,vi, expect, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './Blog_form'

test('renders the blog\'s title and author, but does not render its URL or number of likes', async () => {
  const blog = {
    title: 'how to learn spanish',
    author: 'steve',
    url: 'Unavalilable',
    likes: 0
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('how to learn spanish')
  const author = screen.queryByText('steve')
  const url = screen.queryByText('Unavalilable')
  const likes = screen.queryByText('0')

  expect(title).toBeDefined()
  expect(author).not.toBeInTheDocument()
  expect(url).not.toBeInTheDocument()
  expect(likes).not.toBeInTheDocument()
})

test('the blogs URL and number of likes are shown when the button controlling the shown details has been clicked', async() => {
  const blog = {
    title: 'how to learn spanish',
    author: 'steve',
    url: 'Unavalilable',
    likes: 0
  }

  render(<Blog blog={blog} value={true}/>)

  const title = screen.queryByText('how to learn spanish')
  const author = screen.queryByText('steve')
  const url = screen.queryByText('Unavalilable')
  const likes = screen.queryByText('0')

  expect(author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()

})

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const blog = {
    title: 'how to learn spanish',
    author: 'steve',
    url: 'Unavalilable',
    likes: 0
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateLikes={mockHandler} value={true} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('check that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createNote={createNote} />)

  const title = container.querySelector('.title')
  const author = container.querySelector('.author')
  const url = container.querySelector('.url')
  const create = container.querySelector('.create')

  await user.type(title, 'how to learn spanish')
  await user.type(author, 'steve')
  await user.type(url, 'Unavalilable')
  await user.click(create)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0]).toEqual({
    title: 'how to learn spanish',
    author: 'steve',
    url: 'Unavalilable'
  })
})