const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: 'development',
    devServer: {
        port: 8082
    },
    plugins: [
        new ModuleFederationPlugin({
            // nombre que se usa para importar el modulo desde otro proyecto
            // import('product/ProductsIndex')
            name: 'cartApp',
            // el remoteEntry es como un manifiesto que indica los modulos a cargar
            // para este caso solo el src/index
            // es lo primero que se importa desde el container
            filename: 'remoteEntry.js',
            // modulos que se quieren compartir
            exposes: {
                // se llama boostrap por ees este arrchivo quien exporta la funcino mount que expone la funcinoalidad
                // que usaremos en el container
                './CartIndex': './src/boostrap'
            },
            // shared se usa para compartir este modulo y evitar que el navegador lo descargue cada vez que 
            // otro modulo o archivo lo requiera. De esta manera ahorramos descargas innecesarias.
            // El problema ocurre cuando las versiones son distintas: faker@5.1.0 y faker@4.1.0
            // en este caso, webpack descargara las dos versiones.
            // shared: ['faker'],

            // A diferencia de la expresion anterior, esta ( la de abajo ) especifica explicitamente que solo se descargue
            // una vez el modulo independientemente de las versiones que existan. Si existen diferentes versiones
            // entonces aparecera una advertencia en el navegador diciendo que las otras versiones no se descargaron
            shared: {
                faker: {
                    singleton: true
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}