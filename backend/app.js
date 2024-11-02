// Todo: Install express, and use express

const express = require('express');

const app = express(); // Returns an express app, big chain of middlewares which is for incoming request



//Todo: Adding a middleware
//* .use(req, res, next) 3 arguments, and next function should be called and it moves on to the next middleware function

// app.use((req, res, next) => {
//*    SOME STATEMENTS
//*    next(); // Navigates to the next middleware, continues it's journey
//  }

app.use((req, res, next) => {
  console.log("First Middleware executed");
  // If we want to execute the next middleware
  // next(); // It will be stuck in infinite, it is not sending RESPONSE, or calling next()
  // * Best practice: to return a response when not calling for next() middleware
  next();
});

app.use((req, res, next) => {
  //! If we want to end it, then one way to do it is send a response
  res.send('Hello from the express!'); //End the response, writingStream
})


// Wire up simple express app with the server.js, where we ofcourse listen to incoming request
// Export this app

module.exports = app;