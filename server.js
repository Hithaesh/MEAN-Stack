const http = require('http');
const app = require('./backend/app');

const port = process.env.PORT || 3000;


app.set('port', port)
const server = http.createServer(app);

server.listen(port);

// server.js is responsible only for listening and passing requests to app.js, 
// while app.js handles the routing, logic, and response.