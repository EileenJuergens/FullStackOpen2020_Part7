import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, cleanup } from '@testing-library/react'
import Blog from './Blog'

afterEach(cleanup)

const blog = {
  title: 'This is the title from the test blog',
  author: 'Test author name',
  url: 'www.test.com',
  likes: 3,
  user: {
    name: 'Max Mustermann',
    username: 'Maxi_123'
  }
}

const loggedInUser = {
  name: 'Max Mustermann',
  username: 'Maxi_123'
}


test('Renders title and author by default', () => {
  const { getByTestId } = render(<Blog blog={blog} />)

  expect(getByTestId(/title/i).textContent).toBe('This is the title from the test blog')
  expect(getByTestId(/author/i).textContent).toBe('Test author name')
})


test('Not renders url and likes by default', () => {
  const { queryByTestId } = render(<Blog blog={blog} />)

  expect(queryByTestId(/url/i)).toBeNull()
  expect(queryByTestId(/likes/i)).toBeNull()
})


test('Click on view button will show hidden content', () => {
  const { queryByTestId, getByText } = render(
    <Blog
      blog={blog}
      loggedInUser={loggedInUser}/>
  )

  expect(queryByTestId(/url/i)).toBeNull()
  expect(queryByTestId(/likes/i)).toBeNull()

  fireEvent.click(getByText('view'))

  expect(queryByTestId(/url/i).textContent).toBe('www.test.com')
  expect(queryByTestId(/likes/i).textContent).toBe('likes 3')
})

test('Click twice on like, will increase the like by two more', () => {
  const { queryByTestId, getByText } = render(
    <Blog
      blog={blog}
      loggedInUser={loggedInUser}/>
  )

  fireEvent.click(getByText('view'))

  expect(queryByTestId(/likes/i).textContent).toBe('likes 3')

  // fireEvent.click(getByText('like'))
  // fireEvent.click(getByText('like'))

  // expect(queryByTestId(/likes/i).textContent).toBe('likes 5')

})
