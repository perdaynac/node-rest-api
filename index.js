/*

    Primary file for the API

*/


// Dependencies
const http = require('http');
const url = require('url');



// The server should respond to all request with a string
const server = http.createServer(function(req, res) {

  // Get Url and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Send the response
  res.end('Hello world!\n');

  // Log the request path
  console.log('Request receive on path: ' + trimmedPath);



  

});

// Start the server and have it listen to port 3000
server.listen(3000, function() {

  console.log("The server is listening to port 3000 now");


});
