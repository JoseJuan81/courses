/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./config');
// const lib = require('.');
const handlers = require('./handlers');
const helpers = require('./helpers.js');

/*
 * @TODO delete this after test
 */
// lib.delete('test', 'file1', function(err, fileData) {
// 	console.log('The error deleting the file was:', err);
// 	console.log('The data from the file is: ', fileData);
// });

// Inicializar server object
const server = {};


// Instantiate HTTP server
server.httpServer = http.createServer(function(req, res) {
  server.unifiedServer(req, res);
});

// server.httpsServerOptions = {
// 	key: fs.readFileSync(path.join(__dirname, '../http/key.pem')),
// 	cert: fs.readFileSync(path.join(__dirname, '../http/cert.pem')),
// };

// Instantiate HTTPS server
// const httpsServer = https.createServer(httpsServerOptions, unifiedServer)
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res) {
  server.unifiedServer(req, res);
});

server.unifiedServer = function(req, res) {
	// Get the URL and parse it
	const parsedUrl = url.parse(req.url, true); // true para que cree un objeto incluyendo query string. Investigar mas.

	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the method
	const method = req.method.toLowerCase();

	// Get query parameters
	const queryStringObject = parsedUrl.query;

	// Get headers
	const headers = req.headers;

	// Parsing de payload
	let data = '';

	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		data += chunk;
	});

	req.on('end', function() {
		const parsedData = helpers.stringToObject(data);

		const dataForHandler = {
			payload: parsedData,
			headers,
			method,
			queryStringObject,
		};

		const chosenHandler = typeof server.routes[trimmedPath] !== 'undefined' ? server.routes[trimmedPath] : handlers.notFound;

		// Ejecutar el handler
		chosenHandler( dataForHandler, function( statusCode, payload, contentType ) {
			const resContentType = typeof contentType === 'string' ? contentType : 'json';
            const resCode = typeof statusCode === 'number' ? statusCode : 200;
            let parsedResPayload = '';

            // preguntar si la respuesta es de JSON
            if ( resContentType === 'json' ) {

                const resPayload = typeof payload === 'object' ? payload : {};
                parsedResPayload = JSON.stringify(resPayload);
                
                // responder al solicitante con el tipo de dato que envio
                // esto tambien es un stream;
                res.setHeader( 'Content-type', 'application/json' );
            }
            
            // pregruntar si la respuesta es un archivo HTML
            if ( resContentType === 'html' ) {

                parsedResPayload = typeof payload === 'string' ? payload : '';
                res.setHeader( 'Content-type', 'text/html' );
            }

            res.writeHead( resCode );
            res.end( parsedResPayload );

		})
	});
};


// Crear manejador de rutas
server.routes = {
	'': handlers.index,
	'account/create': handlers.accountCreate,
	'account/edit': handlers.accountEdit,
	'account/deleted': handlers.accountDeleted,
	'session/create': handlers.sessionCreate,
	'session/deleted': handlers.sessionDeleted,
	'checks/all': handlers.checkList,
	'checks/create': handlers.checkCreate,
	'checks/edit': handlers.checkEdit,
	'ping': handlers.ping,
	'sample': handlers.sample,
	'api/users': handlers.users,
	'api/tokens': handlers.tokens,
	'api/checks': handlers.checks
}

// metodo init inicializa servidores
server.init = function() {
// Start the server and have it listen on port 3000
	server.httpServer.listen(config.httpPort, function() {
		console.log("The http server is listening on port " + config.httpPort);
	});
	
	// comentado porque no tengo certificados cert.pem ni key.pem
	// Start the server and have it listen on port 3000
	// server.httpsServer.listen(config.httpsPort, function() {
	// 	console.log("The http server is listening on port " + config.httpsPort);
	// });
}

module.exports = server;
