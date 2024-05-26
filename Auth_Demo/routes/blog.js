const express = require('express')
const Blog = require('../models/Blog')
const router = express.Router()
const verifyJWT = require('../middleware/user.js')
const {
  readAccess,
  writeAccess,
  updateAccess,
  deleteAccess,
} = require('../middleware/access.js')

router.use(verifyJWT)

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
    return res.json({ message: 'Successful', blogs, success: true }).status(200)
  } catch (error) {
    console.error(error)
  }
}

const createBlog = async (req, res) => {
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
}

const updateBlog = async (req, res) => {
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
      .json({
        message: 'successfully updated blog',
        success: true,
        updatedBlog,
      })
      .status(200)
  } catch (error) {
    console.error(error)
  }
}

const deleteBlog = async (req, res) => {
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
}

router.route('/getBlogs').get(readAccess, getBlogs)

router.route('/createBlog').post(writeAccess, createBlog)

router.route('/updateBlog').patch(updateAccess, updateBlog)

router.route('/deleteBlog').delete(deleteAccess, deleteBlog)

module.exports = router
