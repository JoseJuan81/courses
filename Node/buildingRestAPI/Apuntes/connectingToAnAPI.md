# CONECTANDO CON TWILIO PARA ENVIAR SMS
con **Twilio** es posible enviar mensajes de texto y hacer llamadas.
Es una libreria que se integrara con el proyecto para enviar notificaciones al usuario.

El proceso de integracion de la libreria en el proyecto sera mediante una funcion **Helper**

```js
var queriString = require('querystring');
var https = requier('https');
...
helper.sendTwilioSms = function (phone, msg, callback) {
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
			path: '/2010-04-01/Accounts/ + config.twilio.accountsSid + '/Messages.json',
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
```

Agregar en el archivo de configuracion, las variables requeridas para la integracion con Twilio
```js
// dentro de lib.config.js

// ir a la plataforma de twilio y crear un cuenta para obtener accountsSid, authToken y fromPhone
enviroment.staging = {
	envName: 'staging',
	hashingSecret: 'clave-secreta-encriptar',
	httpPort: 3005,
	httpsPort: 3006,
	maxChecks: 5,
	twilio {
		accountsSid: '',
		authToken: '',
		fromPhone: ''
	}
};
```
