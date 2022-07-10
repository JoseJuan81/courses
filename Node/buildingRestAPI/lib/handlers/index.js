/*
 * Archivo con los handres de las rutas
 */

// Dependencias
var _users = require('./users');
var _tokens = require('./tokens');
const helpers = require('../helpers');

// Crear contenedor de rutas
const handlers = {};

handlers.ping = function (data, callBack) {
	callBack(200);
};

handlers.sample = function (data, callBack) {
	callBack(200, data);
};

handlers.notFound = function(data, callBack) {
	callBack(404);
};

handlers.users = function(data, callback) {
	var validMethods = ['get', 'post', 'delete', 'put'];

	if (validMethods.indexOf(data.method) > -1) {
	// usar un sub-handler para manjear todas las logicas del CRUD
		_users[data.method](data, callback);
	} else {
		callback(405, { error: 'Method not allowed' });
	}
}

handlers.tokens = function(data, callback) {
	const validMethods = ['get', 'post', 'delete', 'put'];

	if (validMethods.indexOf(data.method) > -1) {
	// usar un sub-handler para manjear todas las logicas del CRUD
		_tokens[data.method](data, callback);
	} else {
		callback(405, { error: 'Method not allowed' });
	}
}

handlers.index = function( data, callback ) {
    const validMethods = ['get', 'post', 'delete', 'put'];

    if (validMethods.indexOf(data.method) > -1) {

        helpers.getTemplate( 'index', function( err, htmlFile ){

            if ( !err && htmlFile ) {
                
                callback( 200, htmlFile, 'html');
            } else {
                
                callback( 500, err, 'html');
            }
        })
    } else {
        callback( 405, undefined, 'html' );
    }
}

module.exports = handlers;
