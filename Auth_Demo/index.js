const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userMiddleware = require('./middleware/user')
const { readAccess, writeAccess } = require('./middleware/access')
const authRouter = require('./routes/auth')
const blogRouter = require('./routes/blog')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

//middleware provided by Express to parse incoming JSON requests.
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('MongoDB is connected!')
})

app.use('/auth', authRouter)
app.use('/blog', blogRouter)

app.get('/protected', userMiddleware, (req, res) => {
  const { username } = req.user
  res.send(`This is a Protected Route. Welcome ${username}`)
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/read', userMiddleware, readAccess, (req, res) => {
  res.send('Read Access Granted')
})

app.post('/write', userMiddleware, writeAccess, (req, res) => {
  res.send('Write Access Granted')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
