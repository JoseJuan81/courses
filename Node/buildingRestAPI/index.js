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