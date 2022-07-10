/*
 * Archivo de funciones varias tipo ayuda
 */

// Dependencias
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');

var config = require('./config');
var utils = require('./utils');

var helpers = {};

/*
 * Encriptacion
*/
helpers.hash = function(str) {
	if (typeof str === 'string') {
		var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
}

helpers.stringToObject = function(str) {
	try {
		var obj = JSON.parse(str);
		return obj;
	} catch(err) {
		return {};
	}
};

helpers.sendTwilioSms = function (phone, msg, callback) {
	// validar los datos de entrada
		var validPhone = typeof phone === 'string' && phone.trim().length >= 9 && phone.trim().length <= 10 ? phone.trim() : false;
		var validMsg = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length < 1600 ? msg.trim() : false;

	if (validPhone && validMsg) {
		// configurar el payload a enviar por twilio
		var payload = {
			from: config.twilio.phone,
			to: phone,
			body: msg
		}
		// parsear el payload para adecuarlo a las especificaciones de SMS
		var stringPayload = queriString.stringify(payload);

		// configurar la solicitud para enviar la informacion al API de Twilio
		var requestsDetails = {
			protocol: 'https:',
			hostname: 'api.twilio.com',
			method: 'POST',
			path: '/2010-04-01/Accounts/' + config.twilio.accountsSid + '/Messages.json',
			auth: config.twilio.accountsSid + ':' + config.twilio.authToken,
			headers: {
				// por este tipo de contenido es que se usa el modulo queryString
				// si el content-type es application/json entonces se puede usar JSON.Stringify()
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-lenght': Buffer.byteLength(stringPayload)
			}
		}

		// armar la solicitud para enviar a Twilio
		var req = https.request(requestsDetails, function(res) {
			var status = res.statusCode;

			if (status === 200 || status === 201) {
				callback(false);
			} else {
				callback('The returned status from Twilio api was' + status);
			}
		});

		// este listener es para evitar una excepcion o que la aplicacion termine su ejecucion por algun error
		req.on('error', function(e) {
			callback(e);
		});

		// agregar el paylod al servicio
		req.write(stringPayload);

		// enviar solicitud
		req.send();
	} else {
		callback('Lo parametros suministrados no son validos o estan incompletos');
	}
}

helpers.createRandomString = function( strLen ) {

	const validLength = typeof strLen === 'number' && strLen > 0 ? strLen : false;

	if ( validLength ) {

		const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let id = '';

		for( let i = 1; i <= strLen; i += 1 ) {
			const randomCharater = possibleCharacters.charAt( Math.floor( Math.random() * strLen ) );
			id += randomCharater;
		}

		return id;
	} else {
		return false;
	}
}

helpers.getTemplate = function( templateName, callback ) {

    const validTemplateName = utils.typeString( templateName) && utils.lengthGreaterThan( templateName, 0 ) ? templateName : false;

    if ( validTemplateName ) {

        const templateDir = path.join( __dirname, '/../templates/' );
        const filePath = templateDir + templateName + '.html';

        fs.readFile( filePath, 'utf8', function( err, file ){

            if ( !err && file && utils.lengthGreaterThan( file, 0) ) {
                helpers.interpolateHtml( 'header', file, function( err, str){

                    if ( !err && str) {

                        helpers.interpolateHtml( 'footer', file, function( err, str){

                            if ( !err && str ) {

                                callback( false, str );
                            } else {

                                callback('Error: No se pudo agregar el footer en body de html')
                            }
                        })

                    } else {
                        callback('Error: No se pudo agregar el header en body de html')
                    }
                })
            } else {
                callback( 'Error: NO existe archivo con el nombre especificado' );
            }
        })
    } else {
        callback( 'Error: nombre archivo no valido');
    }
}

helpers.interpolateHtml = function( partialName, baseFile, callback) {
    const validPartialName = utils.typeString( partialName ) && utils.lengthGreaterThan( partialName, 0 ) ? partialName : false;

    if ( validPartialName ) {

        const partialPath = path.join( __dirname, '/../templates/' + partialName + '.html')
        fs.readFile(partialPath, 'utf8', function( err, fileContent ){
            if( !err && fileContent ) {

                const replace = fileContent;
                const find = '{{' + partialName + '}}';
                const final = baseFile.replace( find, replace );

                callback( false, final )
            } else {
                callback('Error: No existe un archivo html parcial con ese nombre')
            }
        })
    } else {
        callback('Error: No se suministro un nombre valido para el html parcial')
    }
    
}

module.exports = helpers;

