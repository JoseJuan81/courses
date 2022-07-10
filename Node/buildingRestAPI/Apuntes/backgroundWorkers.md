# BACKGROUND WORKERS

Refactorizar el codigo:
1. Crear archivo `server.js` dentro de carpeta `lib`
2. Crear archivo `workers.js` dentro de carpeta `lib`
3. Refactorizar el archivo `index.js` a lo siguiente:
```js
// Dependencias
const server = require('./lib/server');
const workers = require('./lib/workers');

// app
const app = {};
app.init = function() {
    // inicializar el servidor
    server.init();

    // inicializar el workers
    workers.init();
}

// Inicializar app
app.init();

module.exports = app;
```
4. Refactorizar archivo `server.js`: crear `server object` con la idea de exportarlo usar sus metodos
```js
/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const config = require('./config');
// const lib = require('.');
const handlers = require('./handlers');
const helpers = require('./helpers.js');
const path = require('path');

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

		const response = {
			payload: parsedData,
			headers,
			method,
			queryStringObject,
		};

		const chosenHandler = typeof server.routes[trimmedPath] !== 'undefined' ? server.routes[trimmedPath] : handlers.notFound;

		// Ejecutar el handler
		chosenHandler(response, function(statusCode, payload) {
			const reqCode = typeof statusCode === 'number' ? statusCode : 200;
			const reqPayload = typeof payload === 'object' ? payload : {};
			const parsedReqPayload = JSON.stringify(reqPayload);

			// responder al solicitante con el tipo de dato que envio
			// esto tambien es un stream;
			res.setHeader('Content-type', 'application/json');
			res.writeHead(reqCode);
			res.end(parsedReqPayload);
		})
	});
};


// Crear manejador de rutas
server.routes = {
	'ping': handlers.ping,
	'sample': handlers.sample,
	'users': handlers.users,
	'tokens': handlers.tokens,
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
```
5. Agregar metodo en `lib/data` para listar los archivos de una carpeta
```js
lib.list = function (dir, callback) {

	fs.readdir(lib.baseDir + dir + '/', function(err, data) {
		if (!err && data && data.length > 0) {
			var trimmedFilesNames = [];
			data.forEach(function(fileName) {
				var onlyName = fileName.replace('.json', '');
				trimmedFilesNames.push(onlyName);
			})

			callback(false, trimmedFilesNames);
		} else {
			callback(err, data);
		}
	})
}
```
6. Crear archivo `workers.js` dentro de la carpeta `lib`
```js
/**
 * Worker-related tasks
 */

 // Dependencies
 var path = require('path');
 var fs = require('fs');
 var lib = require('../lib');
 var http = require('http');
 var https = require('https');
 var helper = require('./helpers');
 var url = require('url');

 // Inicializar Worker object
 var workers = {};

workers.init = function() {
    // Ejecuta los checks inmediatamente
    workers.gatherAllChecks();

    // Llama a un bucle para que ejecute los checks mas tarde
    workers.loop();
}

module.exports = workers;
```
7. Crear funcion `loop` que se ejecute cada minuto
```js
workers.loop = function() {

    setInterval(function() {

        workers.gatherAllChecks();

    }, 1000 * 60);

}
```

8. Crear funcion `gatherAllChecks`
```js
workers.gatherAllChecks = function() {
    // listar todos los checks que existen en el sistema
    lib.list('checks', function(err, checks) {

        if (!err && checks && checks.length > 0) {
            // recorrer los checks para leerlos y poder validarlos
            checks.forEach(function(check) {

                lib.read('check', check, function(err, checkData) {

                    if (!err && checkData) {
                        // enviar los datos del check al validador
                        workers.validateCheckData(checkData);

                    } else {
                        console.log('Error leyendo un archivo check')
                    }
                })

            })
        } else {
            console.log('No se consiguieron checks para procesar')
        }
    })
}
```

9. Crear funcion `validateCheckData`
```js
workers.validateCheckData = function(checkData) {
    var localCheckData = (typeof checkData === 'object' && checkData !== null) ? checkData : {};

    localCheckData.id = (typeof localCheckData.id === 'string' && localCheckData.id.trim().length === 20)
        ? localCheckData.id.trim() : false;
    localCheckData.userPhone = (typeof localCheckData.phone === 'string' && localCheckData.phone.trim().length === 10)
        ? localCheckData.phone.trim() : false;
    localCheckData.protocol = (typeof localCheckData.protocol === 'string' && ['http', 'https'].indexOf(localCheckData.protocol) > -1)
        ? localCheckData.protocol.trim() : false;
    localCheckData.url = (typeof localCheckData.url === 'string' && localCheckData.url.trim().length > 0)
        ? localCheckData.url.trim() : false;
    localCheckData.method = (typeof localCheckData.method === 'string' && ['get', 'post', 'put', 'delete'].indexOf(localCheckData.method) > -1)
        ? localCheckData.method.trim() : false;
    localCheckData.successCode = (typeof localCheckData.successCode === 'object' && localCheckData.successCode instanceof Array && localCheckData.successCode.length > 0)
        ? localCheckData.successCode : false;
    localCheckData.timeoutSeconds = (typeof localCheckData.timeoutSeconds === 'number' && localCheckData.timeoutSeconds % 1 === 0 && localCheckData.timeoutSeconds >= 1 && localCheckData.timeoutSeconds <= 5)
        ? localCheckData.timeoutSeconds : false;

    // verificar si el workers ya agrego las propiedades de rastreo para saber si el check ya fue visto o revisado

    // el state indica si el check esta activo o no
    localCheckData.state = (typeof localCheckData.state === 'string' && ['up', 'down'].indexOf(localCheckData.state) > -1)
        ? localCheckData.state.trim() : 'down';
    // el lastChecked indica si ha sido checkeado y cuando. 
    localCheckData.lastChecked = (typeof localCheckData.lastChecked === 'number' && localCheckData.lastChecked > 0)
        ? localCheckData.lastChecked : false;
    
    // Si todos las propiedades estan bien entonces se pasa la informacion al siguiente paso del proceso
    var valid = [
        'id',
        'userPhone',
        'protocol',
        'url',
        'method',
        'successCodes',
        'timeoutSeconds',
    ].every(function(k) { return !!localCheckData[k] });

    if (valid) {

        workers.performChecks(localCheckData);

    } else {
        console.log('uno de los checks no esta correctamente formateado');
    }

}
```
10. crear funcion `performChecks`
```js

// Esta funcion ejecuta el check (url)
workers.performChecks = function(checkData) {

    // Prepara la salida inicial para el check
    var checkOutcome = {
        error: false,
        responseCode: false
    }

    // Especificar que el outcome no ha salido o no ha sido enviado
    var outcomeSent = false;

    // Parsear la url
    var parsedUrl = url.parse(checkData.protocol + '://' + checkData.url);
    var hostname = parsedUrl.hostname;
    var path = parsedUrl.path; // usar path y no pathname para incluir los querystring

    var requestDetails = {
        protocol: checkData.protocol + ':',
        hostname,
        method: checkData.method.toUpperCase(),
        path,
        timeout: checkData.timeoutSeconds * 1000
    }

    var _moduleToUse = checkData.protocol === 'http' ? http : https;

    var req = _moduleToUse.request(requestDetails, function(res) {

        var status = res.statusCode;

        // actualizar variable checkOutcome
        checkOutcome.responseCode = status;

        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', function(e) {

        checkOutcome.error = {
            error: true,
            value: e
        }

        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', function(e) {

        checkOutcome.error = {
            error: true,
            value: 'timeout'
        }

        if (!outcomeSent) {
            workers.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.end();
}
```

11. crear funcion `processCheckOutcome`
```js
workers.processCheckOutcome = function(checkData, checkOutcome) {

    // decidir si el check esta `up` o `down`
    var state = !checkOutcome.error && checkOutcome.responseCode && checkData.successCode.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    var alertWarranted = checkData.lastChecked && checkData.state !== state ? true : false;

    var newCheckData = checkData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    lib.update('checks', newCheckData.id, newCheckData, function(err) {
        if (!err) {

            if (alertWarranted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                console.log('No ha cambiado el check con id' + newCheckData.id);
            }

        } else {
            console.log('Error: actualizando check desde el worker');
        }
    })
}
```

12. crear funcion `alertUserToStatusChange`
```js
workers.alertUserToStatusChange = function(newCheckData) {
    var msg = 'Alert: your check for ' + newCheckData.method.toUpperCase() + ' ' + newCheckData.protocol + '://' + newCheckData.url + ' is currently' + newCheckData.state;

    lib.sendTwilioSms(newCheckData, newCheckData.userPhone, function(err) {
        if (!err) {
            console.log('Exito: El usuario fue notificado del cambio de estado en sus checks via sms: ' + msg)
        } else {
            console.log('Error: no se pudo enviar una notificacion al usuario' + newCheckData.userPhone + ' por el cambio de estado de sus checks');
        }
    })
}
```