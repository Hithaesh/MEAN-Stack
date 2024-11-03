// Todo: Install express, and use express

const express = require('express');

const app = express(); // Returns an express app, big chain of middlewares which is for incoming request



//Todo: Adding a middleware
//* .use(req, res, next) 3 arguments, and next function should be called and it moves on to the next middleware function

// app.use((req, res, next) => {
//*    SOME STATEMENTS
//*    next(); // Navigates to the next middleware, continues it's journey
//  }

// app.use((req, res, next) => {
//   console.log("First Middleware executed");
//   // If we want to execute the next middleware
//   // next(); // It will be stuck in infinite, it is not sending RESPONSE, or calling next()
//   // * Best practice: to return a response when not calling for next() middleware
//   next();
// });

// app.use((req, res, next) => {
//   //! If we want to end it, then one way to do it is send a response
//   res.send('Hello from the express!'); //End the response, writingStream
// })

//Todo: Create a middleware to handle the CORS error, essentially adding headers
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000'];
  const origin = req.header('Origin'); // Gets the origin which is [Protocol://Domain:PORT] from which the request was made.

  if(allowedOrigins.includes(origin)){ // Checks if the incoming request origin is part of the allowedOrigins
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // res.setHeader('Access-Control-Allow-Origin', "*"); //Todo: One way to do, where * entails it is allowed to all origins
  // res.setHeader('Access-Control-Allow-Origin', ['http://localhost:4200', 'http://localhost:3000']); //! Accepts only single origin or "*"
  res.setHeader('Access-Control-Allow-Header', "Origin, X-Requested-With, Content-Type, Accept");

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
})

//Todo: Fetching Posts
app.use('/api/posts',(req, res, next) => {
  //* Will be adding a new field ID, because Databases always have an id.
  // We can't use to post.model, we don't write TS code, we stick to vanilla JS
  const post = [ //Dummy Posts
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
  //res.json(posts);
  res.status(200).json({ // No need of return, because it is the last statement in this function
    message: 'Posts fetched successfully!',
    Posts: post,
  });
  // no need of next()
})



// Wire up simple express app with the server.js, where we ofcourse listen to incoming request
// Export this app

module.exports = app;