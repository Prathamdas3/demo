const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userMiddleware  = require("./middleware/user");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();
const port = process.env.PORT;

//middleware provided by Express to parse incoming JSON requests.
app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("MongoDB is connected!");
});

app.use('/auth', authRouter);

app.get("/protected", userMiddleware, (req, res) => {
  const { username } = req.user;
  // res.json({ username });
  res.send(`This is a Protected Route. Welcome ${username}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});