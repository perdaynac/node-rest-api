/*

    Primary file for the API

*/


// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');


// Instantiating HTTP server
const httpServer = http.createServer(function(req, res) {

    unifiedServer(req, res);
  

});

// Start the server and have it listen to the port specified in config-file/console
httpServer.listen(config.httpPort, function() {

  console.log("The server is listening to port " + config.httpPort + " in " + config.envName + " mode");


});

// Instantiating HTTP server
let httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res) {

    unifiedServer(req, res);
  

});

// Start the server and have it listen to the port specified in config-file/console
httpsServer.listen(config.httpsPort, function() {

  console.log("The server is listening to port " + config.httpsPort + " in " + config.envName + " mode");


});

// All the server logic for both the http and https server
let unifiedServer = function (req, res) {

    // Get Url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');


    // Get the query string as an object
    var queryStringObject = parsedUrl.query;


    // Get HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Set the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
    
        buffer += decoder.write(data);

    });

    req.on('end', function(){
    
        buffer += decoder.end();

        // Choose the handler this request should go to
        // If one is not found, use the notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {

            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer,


        };


        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {

            // Use the statusCode called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};


            // Convert the payload to a string
            payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log('Returning this response: ', statusCode, payloadString);
            //console.log('Request receive on path: ' + trimmedPath + ' with this method: ' + method + ' with these query string parameters: ', queryStringObject);
            //console.log('Request received with this payload: ', buffer);

        }); 

    });


}




// Define the handlers
var handlers = {};


handlers.sample = function(data, callback) {
    // Callback a http status code and a payload object

    callback(406, {'name' : 'sample handler'})
};

handlers.ping = function(data, callback) {
    // Callback a http status code and a payload object

    callback(200)
};

handlers.notFound = function(data, callback) {

  callback(404);

};


// Define a request router
var router = {
  
  'sample' : handlers.sample,
  'ping' : handlers.ping

}
