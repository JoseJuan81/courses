/*
 * Logica para Crear, Leer, Actualizar y Eliminar usuarios
 */

// Dependencias
var helpers = require('../helpers');
var lib = require('../index.js');
const tokens = require('./tokens');

// Contenedor de funciones
var users = {};

/*
 * @type UserDataType
 * @property {string} firstname - requerida
 * @property {string} lastname - requerida
 * @property {string} password - requerida
 * @property {string} phone - requerida
 * @property {boolean} tosAgreement - requerida
 */
/*
 * Crear un archivo con la informacion de la solicitud
 * @param {UserDataType} - data
 */
users.post = function(data, callback) {
	// Verificar que los campos de data tengan el tipo de variable correcto
	var firstname = typeof data.payload.firstname === 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
	var lastname = typeof data.payload.lastname === 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
	var password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
	var tosAgreement = typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement === true ? true : false;

	// verificar que todos los campos hayan pasado la validacion anterior
	if (firstname && lastname && phone && tosAgreement && password) {
		// verificar que el usuario entrante no exista en nuestro registro
		lib.read('users', phone, function(err) {
			if (err) {
				// como el archivo no existe entonces el metodo `read` retorna un error
				// entonces tenemos la seguridad de crear el registro

				// encriptar el password con modulo crypto que viene en node.js
				const passwordHashed = helpers.hash(password);

				if (passwordHashed) {
					// data a guardar en archivo
					const userData = {
						firstname,
						lastname,
						password: passwordHashed,
						tosAgreement,
					}

					lib.create('users', phone, userData, function(error) {
						if (error) {
							callback(500, { error: 'Error creating the user' });
						} else {
							callback(201, { data: 1 });
						}
					})
				} else {
					callback(500, { error: 'Error encriptando password' });
				}
			} else {
				callback(400, { error: 'This user already exist' });
			}
		});
	} else {
		callback(404, { error: 'Missing required fields' });
	}
} 

users.get = function(data, callback) {
	// del query string obtener el phone
	var phone = data.queryStringObject.phone;

	// validar variable phone
	phone = typeof phone === 'string' && phone.trim().length >= 10 ? phone.trim() : false;

	if (phone) {

		const token = typeof data.headers.token === 'string' ? data.headers.token : false;

		// verificar que el token sea valido
		tokens.verifyToken( token, phone, function( valid ) {

			if ( valid ) {

				// verificar que exista ese phone. Buscar el archivo en el registro
				lib.read('users', phone, function(err, userData) {

					if (!err && userData) {
						var parsedUserData = typeof userData === 'string' ? JSON.parse(userData) : userData;
						delete parsedUserData.password;
						callback(200, parsedUserData);
					} else {
						callback(404, { error: 'Usuario no existe con ese numero telefonico' });
					}
				})

			} else {

				callback( 403, { Error: 'Usuario no autenticado' })
			}
		})
		
	} else {
		callback(400, { error: 'Missing required field phone. Type string and 10 characters' });
	}
}

users.put = function(data, callback) {
	// Verificar el campo requerido: phone.
	// requerido porque con este dato ubicamos el registro
	var phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;

	// Verificar que los campos opcionales de data tengan el tipo de variable correcto
	var firstname = typeof data.payload.firstname === 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
	var lastname = typeof data.payload.lastname === 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
	var password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

	if (phone) {

		if (firstname || lastname || password) {
			// busco el registro para porder actualizarlo
			lib.read('users', phone, function(err, userData) {
				if (err) {
					callback(400, { error: 'The user does not exist' });
				} else {
					var localUserData = helpers.stringToObject(userData);

					if (firstname) {
						localUserData.firstname = firstname;
					}

					if (lastname) {
						localUserData.lastname = lastname;
					}

					if (password) {
						localUserData.password = helpers.hash(password);
					}

					lib.update('users', phone, localUserData, function(err) {
						if (err) {
							callback(500, { error: 'Error updating the user' });
						} else {
							callback(201, { data: 1 });
						}
					});
				}
			})

		} else {
			callback(404, { error: 'Missing fields to update' });
		}

	} else {
		callback(400, { error: 'Missing required field' });
	}
}

users.delete = function(data, callback) {
	// del query string obtener el phone
	var phone = data.queryStringObject.phone;

	// validar variable phone
	var phone = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;

	if (phone) {

		lib.read('users', phone, function(err) {
			if (err) {
				callback(400, { error: 'User not found' });
			} else {
				lib.delete('users', phone, function(err) {
					if (err) {
						callback(500, { error: 'Error deleting de user' });
					} else {
						callback(200, { data: 1 })
					}
				})
			}
		})

	} else {
		callback(404, { error: "Missing required field" })
	}
}
module.exports = users;
