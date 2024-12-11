
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();


const Post = require('./models/post');

const app = express();

const mongoDBUri = process.env.MONGO_DB_URI;
mongoose.connect(mongoDBUri)
.then(() => {
  console.log("Successfully connected to DB");
})
.catch(() => {
  console.log("Connection Failed!");
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000'];
  const origin = req.header('Origin');

  if(allowedOrigins.includes(origin)){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // res.setHeader('Access-Control-Allow-Origin', "*");

  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
})


app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  post.save();
  res.status(201).json({
    message: "Post added Successfully"
  })
})

app.get('/api/posts',(req, res, next) => {
  Post.find()
  .then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully!',
      Posts: documents,
    });
  })
})

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
  })
  res.status(200).json({
    message: "Post deleted"
  })
})

module.exports = app;