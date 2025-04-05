var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const likesArray = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likesArray)
  return blogs.find(blog => blog.likes === maxLikes)
}

// gen by AI
const mostBlogs = (blogs) => {
  // Step 1: Count blogs per author
  const blogCounts = _.countBy(blogs, 'author')

  // Step 2: Find the entry with the maximum count
  const maxEntry = _.maxBy(Object.entries(blogCounts), ([author, count]) => count)

  // Step 3: Return the result
  return { author: maxEntry[0], blogs: maxEntry[1] }
}

const mostLikes = (blogs) => {
  // Group blogs by author
  const groupedByAuthor = _.groupBy(blogs, 'author')

  // Calculate total likes for each author
  const likesByAuthor = _.mapValues(groupedByAuthor, blogs =>
    _.sumBy(blogs, 'likes')
  )

  // Find the author with the maximum likes
  const maxEntry = _.maxBy(Object.entries(likesByAuthor), ([author, totalLikes]) => totalLikes)

  // Return the result
  return { author: maxEntry[0], likes: maxEntry[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
