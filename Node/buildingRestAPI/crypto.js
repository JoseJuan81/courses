var crypto = require('crypto');

const pass = '123456 ';
hash = crypto.createHmac('sha256', 'secreto').update(pass).digest('hex');
console.log('contrasena encriptada %s', hash)