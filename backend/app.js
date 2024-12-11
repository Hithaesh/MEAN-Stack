
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

app.use('/api/posts',(req, res, next) => {
  const post = [ 
    {
      id: 'asdadf12324',
      title: 'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id: 'fklhhg324',
      title: 'Second server-side post',
      content: 'This is coming from the server!'
    }
  ];
  res.status(200).json({
    message: 'Post fetched successfully!',
    Posts: post,
  });
})

module.exports = app;