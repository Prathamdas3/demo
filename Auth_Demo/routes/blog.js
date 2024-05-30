const express = require('express')
const Blog = require('../models/Blog')
const router = express.Router()
const verifyJWT = require('../middleware/user.js')
const { GRPC } = require('@cerbos/grpc')
const cerbos = new GRPC('localhost:3593', { tls: false })
const jwtToPrincipal = ({ id, iat, roles = [], ...rest }) => {
  return {
    id: id,
    roles,
    attributes: rest,
  }
}

router.use(verifyJWT)

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Contact not found' })
    }
    const decision = await cerbos.checkResource({
      principal: jwtToPrincipal(req.user),
      resource: {
        kind: 'blog',
        id: blog.id,
        attributes: blog,
      },
      actions: ['read'],
    })

    if (decision.isAllowed('read')) {
      return res
        .json({ message: 'Successful', blog, success: true })
        .status(200)
    } else {
      return res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.error(error)
  }
}
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
    if (!blogs) {
      return res.status(404).json({ error: 'Contact not found' })
    }
    const decision = await cerbos.checkResources({
      principal: jwtToPrincipal(req.user),
      resources: blogs.map((blog) => ({
        resource: {
          kind: 'blog',
          id: blog.id,
          attributes: blog,
        },
        actions: ['readAll'],
      })),
    })

    if (decision.isAllowed('read')) {
      return res
        .json({ message: 'Successful', blog, success: true })
        .status(200)
    } else {
      return res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.error(error)
  }
}

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body
    const decision = await cerbos.checkResource({
      principal: jwtToPrincipal(req.user),
      resource: {
        kind: 'blog',
        id: 'new',
      },
      actions: ['create'],
    })
    if (decision.isAllowed('create')) {
      if (!title || !content) {
        return res.json({ message: 'Title or content invalid' }).status(400)
      }
      const newBlog = new Blog({ title, content })
      await newBlog.save()
      return res
        .json({ message: 'successfully created blog', success: true })
        .status(201)
    } else {
      return res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.error(error)
  }
}

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body
    if (!req.params.id)
      return res.json({ message: 'Id is invalid' }).status(400)
    if (!title || !content) {
      return res.json({ message: 'Title or content invalid' }).status(400)
    }
    const blog = Blog.findOne(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Contact not found' })
    }

    const decision = await cerbos.checkResource({
      principal: jwtToPrincipal(req.user),
      resource: {
        kind: 'blog',
        id: blog.id,
        attributes: blog,
      },
      actions: ['update'],
    })

    if (decision.isAllowed('update')) {
      const newBlog = await Blog.findByIdAndUpdate(id, { title, content })

      const updatedBlog = await Blog.findById(id)
      return res
        .json({
          message: 'successfully updated blog',
          success: true,
          updatedBlog,
        })
        .status(200)
    } else {
      return res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) return res.json({ message: 'Id is invalid' }).status(400)
    const blog = Blog.findOne(req.params.id)

    const decision = await cerbos.checkResource({
      principal: jwtToPrincipal(req.user),
      resource: {
        kind: 'blog',
        id: blog.id,
        attributes: blog,
      },
      actions: ['delete'],
    })
    if (decision.isAllowed('delete')) {
      await Blog.findByIdAndDelete(id)

      return res
        .json({ message: 'successfully deleted blog', success: true })
        .status(200)
    } else {
      return res.status(403).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.error(error)
  }
}

router.route('/getBlogs').get(getBlogs)

router.route('/getBlog/:id').get(getBlog)

router.route('/createBlog/new').post(createBlog)

router.route('/updateBlog/:id').patch(updateBlog)

router.route('/deleteBlog/:id').delete(deleteBlog)

module.exports = router
