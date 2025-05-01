const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.getByTestId('login-form')
    expect(loginForm).not.toBeNull()
  })
})

test.describe('Login', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'admin',
        username: 'admin',
        password: 'password'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Succeeds with correct credentials', async ({ page }) => {
    await page.getByTestId('username').fill('admin')
    await page.getByTestId('password').fill('password')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('login successful')).toBeVisible()
  })

  test('Fails with wrong credentials', async ({ page }) => {
    await page.getByTestId('username').fill('johndoe')
    await page.getByTestId('password').fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('wrong username or password')).toBeVisible()
  })
})

describe('When logged in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByTestId('username').fill('admin')
    await page.getByTestId('password').fill('password')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('login successful')).toBeVisible()
  })

  test.only('A blog can be created', async ({ page }) => {
    await createBlog(page, 'test title', 'test author', 'test url')
    await expect(page.getByText('test title')).toBeVisible()
    await expect(page.getByText('test author')).toBeVisible()
  })

  test('A blog can be liked', async ({ page }) => {
    await page.getByTestId('show').click()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('likes: 1')).toBeVisible()
  })

  test('Delete blog post with confirmation', async ({ page }) => {
    page.once('dialog', async dialog => {
      await dialog.accept()
    })
    await page.getByRole('button', { name: 'remove' }).click()
    await expect(page.getByText('test title')).not.toBeVisible()
  })

  test.only('The blogs are sorted according to likes', async ({ page }) => {
    await createBlog(page, 'first title', 'first author', 'first link')
    await createBlog(page, 'second title', 'second author', 'second link')
    await createBlog(page, 'third title', 'third author', 'third link')

    const secondShowButton = page.getByTestId('show').nth(1)
    await secondShowButton.click()

    const likeButton = page.getByRole('button', { name: 'like' })
    await likeButton.click()
    await likeButton.click()

    await page.waitForTimeout(1000)

    const blogRows = page.locator('[data-testid="blogs"] tr')
    await expect(blogRows.nth(0)).toHaveText(/second title/)
    await expect(blogRows.nth(1)).toHaveText(/first title/)
    await expect(blogRows.nth(2)).toHaveText(/third title/)
  })

  test('only the user who added the blog sees the blog\'s delete buttononly the user who added the blog sees the blog\'s delete button', async ({ page }) => {
    await createBlog(page, 'first title', 'first author', 'first link')
    await page.getByTestId('show').click()
    await page.getByRole('button', { name: 'logout' }).click()
    await page.getByTestId('username').fill('admin')
    await page.getByTestId('password').fill('password')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
  })
})


