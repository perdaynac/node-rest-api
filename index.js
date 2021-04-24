/*

    Primary file for the API

*/


// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');



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
    let parsedUrl = url.parse(req.url, true);

    // Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');


    // Get the query string as an object
    let queryStringObject = parsedUrl.query;


    // Get HTTP method
    let method = req.method.toLowerCase();

    // Get the headers as an object
    let headers = req.headers;

    // Set the payload, if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data) {
    
        buffer += decoder.write(data);

    });

    req.on('end', function(){
    
        buffer += decoder.end();

        // Choose the handler this request should go to
        // If one is not found, use the notFound handler
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        console.log("Trimmed path: " + trimmedPath);
        console.log("Type of: "+ typeof(router[trimmedPath]));
        console.log("Type of helpers.x: " + typeof(helpers.x));
        console.log("Type of handlers.x: " + typeof(handlers.x));

        // Construct the data object to send to the handler
        let data = {

            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)

        };


        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {

            // Use the statusCode called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};


            // Convert the payload to a string
            let payloadString = JSON.stringify(payload);

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


// Define a request router
let router = {
  'sample' : handlers.sample,
  'ping' : handlers.ping,
  'users' : handlers.users
}
