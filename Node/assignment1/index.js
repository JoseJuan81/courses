/*
 * 1. It should be a RESTful JSON API that listens on a port of your choice.
 * 2. When someone sends an HTTP request to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want.
 * plus: if the route isn't /hello, I return this message: Sorry :s
 */

/*
 * Primay file for the API
 * RESTfull JSON API: 'Hello world'
 */

var http = require('http');
var config = require('./config.js');
var url = require('url');

var server = http.createServer(function(req, res) {
  unifiedServer(req, res);
});

server.listen(config.port, function() {
  console.log('server listening on port: '+config.port);
});

var unifiedServer = function(req, res) {
  // A new url Object
  var parsedURL = url.parse(req.url, true);

  // the url pathname
  var pathname = parsedURL.pathname; 
  
  // trim the pathname
	var trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

  // encoding the request
  req.setEncoding('utf8');
  
  // handling the payload
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  })

  req.on('end', function() {
    // parsing the incoming payload
    var dataParsed = data ? JSON.parse(data) : '';

    // building the response object
    var method = req.method;
    var headers = req.headers;
    var queryString = parsedURL.query;

    var responsePayload = {
      data: dataParsed,
      method,
      headers,
      queryString,
    }
    // handle the incoming route
    var chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handler.notFound;

    // sending back the response
    chosenHandler(responsePayload, function(statusCode, dataResponse) {
      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(dataResponse);
    });
  })
};

var handler = {};

handler.hello = function(data, callback) {
  var message = "Welcome to this API, I'm Jose Juan a Venezuelan living in Peru, for now";
  callback(200, message)
}

handler.notFound = function(data, callback) {
  callback(404, 'Sorry, :s');
}

var router = {
  'hello': handler.hello,
};
