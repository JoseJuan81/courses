/**
 * Worker-related tasks
 */

 // Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var lib = require('./');

// Inicializar Worker object
var workers = {};

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

// funcion que verifica que el check tenga la estructura adecuada
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
    ].every(function(k) { return !!localCheckData[k] })

    if (valid) {

        workers.performChecks(localCheckData);

    } else {
        console.log('uno de los checks no esta correctamente formateado');
    }

}

// Recorre todos los checks, obtiene sus datos y los envia a una funcion validadora
workers.gatherAllChecks = function() {
    // listar todos los checks que existen en el sistema
    lib.list('checks', function(err, checks) {

        if (!err && checks && checks.length > 0) {
            // recorrer los checks para leerlos y poder validarlos
            checks.forEach(function(check) {

                lib.read('checks', check, function(err, checkData) {

                    if ( !err && checkData ) {
                        // enviar los datos del check al validador
                        workers.validateCheckData(checkData);

                    } else {
                        console.log('Error leyendo un archivo check', check)
                    }
                })

            })
        } else {
            console.log('No se consiguieron checks para procesar')
        }
    })
}

// Este loop ejecutara todos los checks cada minuto
workers.loop = function() {

    setInterval(function() {

        workers.gatherAllChecks();

    }, 1000 * 60);

}

workers.init = function() {
    // Ejecuta los checks inmediatamente
    workers.gatherAllChecks();

    // Llama a un bucle para que ejecute los checks mas tarde
    workers.loop();
}

module.exports = workers;
