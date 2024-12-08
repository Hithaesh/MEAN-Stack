const express = require('express');
const bodyParser = require('body-parser');
const app = express(); // Returns an express app, big chain of middlewares which is for incoming request

// Adding Body-Parser Middleware for all incoming requests 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create a middleware to handle the CORS error, essentially adding headers
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000'];
  const origin = req.header('Origin'); // Gets the origin which is [Protocol://Domain:PORT] from which the request was made.

  if (allowedOrigins.includes(origin)) { // Checks if the incoming request origin is part of the allowedOrigins
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Adding the POST Backend Point
app.post('/api/posts', (req, res, next) => {
  const body = req.body;
  console.log(body);
  res.status(201).json({
    message: "Post added Successfully"
  });
});

// Fetching Posts
app.get('/api/posts', (req, res, next) => {
  const post = [ // Dummy Posts
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
});

module.exports = app;
