
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const postsRoutes = require('./routes/posts');

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

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;