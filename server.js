//Todo: Creating Seperate Folder for angular, and other is backend
//* Created a server.js file in the root of the application
//* New Terminal -> node server.js
//* NodeJs is a runtime env, server side code, there is no DOM

//Todo: Create a Server
// Default way of importing, import HTTP Request
const http = require('http');

 const server = http.createServer((req, res) => {
  res.end('This is my first response');
})

// Use hosting port or this port
server.listen(process.env.PORT || 3000);

//Todo: In browser: localhost:3000