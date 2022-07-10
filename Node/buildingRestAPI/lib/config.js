/*
 * Crear y exportar variables de acuerdo al ambiente de trabajo
 */

var enviroment = {};

enviroment.staging = {
	envName: 'staging',
	hashingSecret: 'clave-secreta-ecncriptar',
	httpPort: 3005,
	httpsPort: 3006,
	maxChecks: 5,
	twilio: {
		accountsSid: '',
		authToken: '',
		fromPhone: ''
	}
};

enviroment.production = {
	envName: 'production',
	hashingSecret: 'clave-secreta-ecncriptar',
	httpPort: 5000,
	httpsPort: 5001,
	maxChecks: 5,
	twilio: {
		accountsSid: '',
		authToken: '',
		fromPhone: ''
	}
};


enviroment.test = {
	envName: 'testing',
	hashingSecret: 'clave-secreta-ecncriptar',
	port: 4000,
	twilio: {
		accountsSid: '',
		authToken: '',
		fromPhone: ''
	}
};

// validar que exista NODE_ENV
var env = process.env.NODE_ENV;
var currentEnv = typeof env !== 'undefined' ? env.toLowerCase() : '';

var envToExport = typeof enviroment[currentEnv] === 'object' ? enviroment[currentEnv] : enviroment.staging;

module.exports = envToExport;
