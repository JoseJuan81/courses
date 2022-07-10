const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: 'development',
    devServer: {
        port: 8080
    },
    plugins: [
        new ModuleFederationPlugin({
            // nombre del modulo
            // cuando se trata del modulo contenedor el nombre no es relevante. solo se agrega por buena practica
            name: 'container',
            // modulos remotos a usar en este proyecto
            remotes: {
                //productsApp@http://localhost:8081/remoteEntry.js
                // productsApp es el nombre del modulo a requerir y el resto es la direccion en la que se encuentra
                // junto con el archivo manifiesto
                productsRemoteModule: 'productApp@http://localhost:8081/remoteEntry.js',
                cartRemoteModule: 'cartApp@http://localhost:8082/remoteEntry.js'
                // products: es key para usar el modulo en este archivo container
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}