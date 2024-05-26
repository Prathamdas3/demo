const express = require('express')
const Blog = require('../models/Blog')
const router = express.Router()
const verifyJWT = require('../middleware/user.js')

router.get('/getBlogs', verifyJWT, async (req, res) => {
  try {
    const blogs = await Blog.find({})
    return res.json({ message: 'Successful', blogs, success: true }).status(200)
  } catch (error) {
    console.error(error)
  }
})

router.post('/createBlog', verifyJWT, async (req, res) => {
  try {
    const { title, content } = req.body
    if (!title || !content) {
      return res.json({ message: 'Title or content invalid' }).status(400)
    }
    const newBlog = new Blog({ title, content })
    await newBlog.save()

    return res
      .json({ message: 'successfully created blog', success: true })
      .status(201)
  } catch (error) {
    console.error(error)
  }
})

router.patch('/updateBlog', verifyJWT, async (req, res) => {
  try {
    const { title, content } = req.body
    const { id } = req.params

    if (!id) return res.json({ message: 'Id is invalid' }).status(400)
    if (!title || !content) {
      return res.json({ message: 'Title or content invalid' }).status(400)
    }
    const newBlog = await Blog.findByIdAndUpdate(id, { title, content })

    const updatedBlog = await Blog.findById(id)
    return res
      .json({ message: 'successfully updated blog', success: true })
      .status(200)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/deleteBlog', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params

    if (!id) return res.json({ message: 'Id is invalid' }).status(400)

    await Blog.findByIdAndDelete(id)

    return res
      .json({ message: 'successfully deleted blog', success: true })
      .status(200)
  } catch (error) {
    console.error(error)
  }
})
