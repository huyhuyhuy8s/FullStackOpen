const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany()

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})
describe('reading the blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should return correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs id are unique identifier property of blog posts not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert(blog.id)
      assert(!blog._id)
    })
  })
})

describe('creating a new blog', () => {
  test('should fail if the title is missing', async () => {
    const blogsAtStart = helper.initialBlogs.length

    const newBlog = {
      title: null,
      author: 'Mike',
      url: 'https://cloud.mongodb.com/v2/mike',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAtEnd = response.body.length

    assert.strictEqual(blogsAtStart, blogsAtEnd)
  })

  test('should fail if the url is missing', async () => {
    const blogsAtStart = helper.initialBlogs.length

    const newBlog = {
      title: 'mongo go go',
      author: 'Mike',
      url: null,
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAtEnd = response.body.length

    assert.strictEqual(blogsAtStart, blogsAtEnd)
  })

  test('should add a blog even likes is missing', async () => {
    const blogsAtStart = helper.initialBlogs.length

    const newBlog = {
      title: 'mongo go go',
      author: 'Mike',
      url: 'mongo.db/blogs/mongo_go_go',
      likes: null,
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const end = await api.get('/api/blogs')
    const blogsAtEnd = end.body.length

    assert.strictEqual(blogsAtStart + 1, blogsAtEnd)
    assert(response.body.likes === 0)
  })

  test('should add a blog when all properties is fulfilled', async () => {
    const blogsAtStart = helper.initialBlogs.length

    const newBlog = {
      title: 'mongo go go',
      author: 'Mike',
      url: 'mongo.db/blogs/mongo_go_go',
      likes: 0,
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const end = await api.get('/api/blogs')
    const blogsAtEnd = end.body.length

    assert.strictEqual(blogsAtStart + 1, blogsAtEnd)
    assert.strictEqual(newBlog.title, response.body.title)
    assert.strictEqual(newBlog.author, response.body.author)
    assert.strictEqual(newBlog.url, response.body.url)
    assert.strictEqual(newBlog.likes, response.body.likes)
  })
})

describe('deleting a single blog', () => {
  test('should successfully remove with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.at(0)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1)
  })
})

describe('updating a single blog', () => {
  test('should successfully updated if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = { ...blogsAtStart.at(0), likes: 100000 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogsInDb()
    assert.deepStrictEqual(blogToUpdate, blogAtEnd.find(blog => blog.id === blogToUpdate.id))
  })
})

after(async () => {
  await mongoose.connection.close()
})
