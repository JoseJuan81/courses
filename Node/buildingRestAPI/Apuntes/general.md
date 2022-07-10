CONSTRUIR UNA RESTFUL API
==========================
Descripcion:
> Restfull API para monitorear URLS y notificar cuando alguna de ellas deja de funcionar y vuelve a funcionar (se cae y se levanta).
> Debe permitirse el flujo de Usuario: registro, inicios de sesion y cierre de sesion.

Especificaciones:
1. La API escucha por un puerto (PORT) determinado y acepta peticiones del tipo POST, GET, PUT, DELETE y HEAD.

2. La API debe permitir que un usuario se conecte para poder crear, editar y eliminar ese usuario creado.

3. La API debe permitir inicio de sesion mediante un token para poder acceder a ciertos sevicio HTTP que requieran autorizacion.

4. La API debe permitir invalidar el token cuando el usuario cierre sesion.

5. La API debe permitir que cualquier usuario con sesion iniciada pueda crear un nuevo monitoreo sobre una determinada URL y conocer el estado de las URL ya registradas.

6. La API debe limitar a 5 las URL que un usuario puede monitorear.

7. La API debe permitir la edicion y/o eliminacion de cualquiera de sus URLs.

8. La API debe tener un proceso "background" o en segundo plano para enviar alertas a los usuarios cuando alguna de sus URL cambie de estado. Los estados son UP y DOWN y el proceso de verificacion debe ocurrir una vez cada minuto. Las alertas deben ser SMS.

## PASO A PASO:
1. Crear archivo index.js en la raiz del proyecto.
2. Crear un servidor usando el modulo 'http' que viene con *Node*. El concepto inicial es definir que es lo que debe hacer el servidor para luego definir por donde escuchar.
3.Crear el servidor escuchando por el puerto 3000 y respondiendo un string a cada peticion hecha (localhost:3000).
4.Correr "node index.js" en la terminal y verificar se muestre: The server is listening on port 3000;
5.Abrir otra pestana de la terminal y escribir: curl localhost:3000. Se debe mostrar: Hello world

```bash
	curl localhost:3000
```

## PARSING REQUEST PATH
6. Crear codigo para mostrar el path de los requests escuchados por el servidor y mostrarlos en la consola.
7. Para trabajar con las URL usamos el modulo 'url' que viene con *Node*.(investigar)

```js
	const parsedUrl = url.parse(req.url, true); // true para que cree un objeto incluyendo query string. Investigar mas.
```

## PARSING HTTP METHODS
8. Determinar cual methodo HTTP el usuario esta usando en su solicitud

## PARSIN QUERY STRING
9. Usar la instancia `parsedUrl` creada con el metodo `url.parse(req.url, true)` (recordar que url es un modulo de *node* y al pasar `true` como segundo argumento retorna la instancia)

10. Usar `query` para obtener el objeto con los queries string: `parsedUrl.query()`
```bash
	curl localhost:3000/foo?fizz=buzz
```
debe retornar: `{ fizz: buzz }`.

> NOTA: Si usas Fish en la terminal tienes que encerrar la url entre comillas simples o dobles para que no ocurran errores.

## PARSING HEADERS
11. Para obtener los *headers* de la solicitud simlemente los requerimos del objeto *req* de la siguiente manera:
```js
	var headers = req.headers
```
Los header traen informacion adicional sobre la solicitud. Para esta prueba se hara la solicitud desde la aplicacion Postman

## PARSING PAYLOAD
12. Con el payload de las solicitudes ocurre algo interesante ya que son "streams". A diferencia del resto (headers, methods, query parameters, path) la informacion que viene en el payload de una solicitud viene por parte, es decir, la informacion es descompuesta y enviada en pequenos pedazos (por parte) a traves de la solicitud http y le corresponde al servidor ensamblarla nuevamente. Debido a esto es necesario implemetar un algoritmo diferente para poder ensamblar y transformar el payload.
```js
...
// parsing de payload
const data = ''; // variable que ira almacenando los pedazos de informacion decodificados.

req.setEncoding('utf8');
req.on('data', function(chunk) { // sobre la solicitud *Node* emite el evento "data" que nos permite manejar la informacion entrante.
	data += chunk; // se codifica la porcion de informacion entrante a formato utf-8 y se almacena en la variable data.
})

req.on('end', function() {
	const parsedData = JSON.parse(data);
	res.write(typeof parsedData);
	res.end();
})
```
Es importante resaltar que los eventos 'data' y 'end' siempre son emitidos, es decir, en cada solicitud que llega al servidor se emiten estos eventos independientemente de la existenacia del payload.

## ROUTING REQUESTS
13. Crear objeto que manejara las rutas
```js
const routes = {
	'sample': handlers.sample,
}
```
14. Crear objeto con handlers para ejecutar acciones de acuerdo a la ruta solicitada por el usuario
```js
	const handlers = {};
	handlers.sample = function(data, callback) {
		callback(200, data);
	};
	handlers.notFound = function(data, callback) {
		callback(404);
	};
```
15. Determinar handler a usar y pasarle el objeto creado
```js
	const handler = routes[pathname];
	const chosenHandler = typeof handler === 'undefined' ? handler.notFound : handler;
```
16. Crear objeto que se debe retornar al usuario
```js
	const dataResponse = {
		data,
		method,
		headers,
		queryStringObject,
	}
```
18. Ejecutar el handler
```js
	chosenHandler(dataResponse, function(code, payload) {
		const newPayload = payload || {};
		const payloadString = JSON.stringify(newPayload);

		res.writeHead(code);
		res.end(payloadString);				
	})
```

## RETURNING JSON
Al momento de responder al usuario se esta enviando un objeto con formato 'String', es decir, un simple string. El usuario tiene que convertirlo a objeto para poder manipularlo. Estableciendo el header "Content-type" igual a "application/json" al momento de responder la solicitd es suficiente para que los navegadores conviertan el string en un objeto.

```js
res.setHeader('Content-type', 'application/json');
```

## ADDING CONFIGURATION
En esta seccion agregaremos un archivo de configuracion para poder cambiar entre ambientes en nuestra aplicacion.

Para cambiar de ambientes usamos, por convencion, la variable `NODE_ENV`. Esta variable guardara el valor del ambiente que por lo general puede ser: `staging` o `development`, `productoin` y `test`. Recordemos que esta variable es accesible desde cualquier lugar de nuestra aplicacion ya que se trata de una variable global a la que accedemos a traves de: `process.env.NODE_ENV`. 

La idea es crear un archivo `config.js` que tenga la configuracion de cada ambiente basado en la variable `NODE_ENV`. Al momento de ejecutar la aplicacion asignamos el valor de esta variable, ej:
```bash
NODE_ENV=production node index.js
```
```bash
NODE_ENV=staging node index.js
```
```bash
NODE_ENV=test node index.js
```
Archivo de configuracion:
```js
// objeto que manejara las variables por ambiente
var enviroment = {};

// ambiente de desarrollo
enviroment.staging = {
	port: 3000,
	envName: 'staging',
};

// ambiente produccion
enviroment.production = {
	port: 5000,
	envName: 'production'
};

// ambiente de prueba
enviroment.test = {
	port: 4000,
	envName: 'testing',
};

// Verificar que exista ambiente, si no, asignar ''.
var env = process.env.NODE_ENV;
var currentEnv = typeof env !== 'undefined' ? env.toLowerCase() : '';

// Verificar que NODE_ENV exista en nuestra variable `enviroment`, si no, asignamos `staging` por defecto
var currentVars = typeof enviroment[currentEnv] === 'object' ? enviroment[currentEnv] : enviroment.staging;

module.exports = currentVars;
```
El archivo es sencillo, esta compuesto por un objeto que contiene variables en funcion del ambiente y posteriormente hacemos algunas validaciones para garantizar que en cualquier caso se exporten valores. Si el usuario asigno un valor arbitrario a `NODE_ENV` que no existe en nuestro archivo `config.js`, retornamos el ambiente `staging` por defecto. Lo mismo ocurre sin el usuario no define valor para `NODE_ENV`.

En nuestro archivo principal requerimos este archivo de configuracion:
```js
var config = require('./config');
```
Por ahora solo lo usaremos para definir el puerto en el que escuchara el servidor.
```js
server.listen(config.port, function() {
	console.log("The server is listening on port "+config.port+ " in mode " +config.envName);
});
```

## HTTPS SUPPORT
En esta seccion generaremos el certificado SSL para que nuestro servidor pueda manejar peticiones o solicitudes HTTPS, el cual es un protocolo de comunicacion mucho mas seguro que HTTP. Para ello, utilizaremos la libreria OPENSSL (https://www.openssl.org/) para generar el certificado.
*reference:*
- https://www.ssllabs.com/
- https://www.feistyduck.com/library/openssl-cookbook/

El procedimiento es el siguiente:
- Descargar la libreria ***OpenSSL*** (version LTS: 1.1.1)
- Crear un directorio, en mi caso sera https
- Ubicarse en el directorio:
```bash
cd https
```
- Ejecutar el comando:
```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
- Debe responder las preguntas que aparecen en su terminal respecto a su sitio web. En caso de estar probando, puede colocar 'localhost'.
NOTA: No todos los generadores de certificados SSL nos permitiran trabajar con subdominios. Algunos certificados serviran para: example.com, www.example.com, normal.example.com mientras que otros solo para: example.com. Usar un generador de certificados SSL u otro dependera de nuestros requerimientos. Le invito a leer la informacion de la referencia.
- Se generaran dos archivos dentro de la carpeta **https**: key.pem y cert.pem

Una vez cumplidos los pasos anteriores, debemos ahora actualizar el archivo de configuracion ya que cada protocolo debe tener su propio puerto:
```js
eviroment.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: 'staging',
}
```
NOTA: Como convencion para ambiente de produccion, el puerto http: 80, mientras que el https: 443.

Es momento de crear nuestro servidor https. Este servidor es practicamente igual al existente y tendra la misma logica para manejar las solicitudes por tanto es necesario refactorizar nuestro codigo:
```js
var httpServer = http.createServer(unifiedServer);
httpServer.listen(config.httpPort, function() {
	console.log('http server listening on port: ' + config.httpPort);
});

var httpsServerOptions = {
	key: fs.readFileSync('./http/key.pem'),
	cert: fs.readFileSync('./http/cert.pem'),
}
var httpsServer = https.createServer(httpsServerOptions, unifiedServer);
httpsServer.listen(config.httpsPort, function() {
	console.log('http server listening on port: ' + config.httpsPort);
});
```

## SERVICIO 1
Este servicio 1 sera usado para determinar si nuestra aplicacion esta viva o no. La idea es tener una ruta especial a la que se pueda consultar y en funcion del resultado sabemos si la aplicacion esta operativa o no.

Con convencion usaremos la ruta "ping" que retornara una codigo 200.
1.Crear ruta 'ping'
2.En callback de ruta 'ping' retornar 200.
3.Levantar el servidor y solicitar ruta `/ping`
4.La respuesta debe ser 200

## STORING DATA
En esta seccion haremos dos cosas, crear un directorio que servira de almacen para nuestra informacion y crear otro en el que crearemos la funcionalidad para Create - Read - Update - Delete (CRUD) archivos en el primer directorio.
1. El primer directorio: `.data`: el `.` inicial es para hacerlo "invisible". Este directorio no se vera si visitamos el proyecto y navegamos por toda su estructura. Una forma de verlo es ejecutando en la terminal:
```bash
ls -la
```
```
|.data
	|users
		|file1.js
	|tokens
	|cheks
|lib
	|index.js
```
2. El segundo directorio: `lib`: Directorio en donde esta la logica para manipular los archivos.
Importaremos dependencias de node como: fs y path.
fs: Modulo de *node* para manipular el sistema de archivos de nuestra compu o servidor (crear, leer, actualizar y eliminar) 
path: Modulo para manipular rutas de nuestro sistema de archivo (nuestras carpetas y archivos).

En el archivo `lib/index.js` definimos la variable que contendra las funciones que manipularan los archivos. Esta variable sera la que exportaremos de este modulo.
```js
var fs = require('fs');
var path = require('path');

var lib = {};
```
Definimos una ruta base al directorio donde estaran los archivos (.data).
```js
var lib.baseDir = path.join(__dirname, '/../.data/')
```

### Funcion para crear un archivo nuevo
https://nodejs.org/api/fs.html#fs_file_system_flags

Para crear un archivo usaremos inicialmente el metodo `fs.open` con el flag `wx` que significa que si el archivo existe arroja un error.
Al ser exitoso, usaremos `fs.writeFile` para escribir dentro del archivo.
*fs.open + 'wx'*: Abre el archivo y si no existe lo crea y retorna un `fd` (file descriptor). Si existe retorna un error.
*fs.write*: Escribe dentro del archivo.
```js
/*
 * Description: Create File
 * @param {string} dir - nombre del directorio
 * @param {string} file - nombre del archivo
 * @param {any} data - Informacion a guardar en el archivo
 * @param {function} callback - function que retorna error o exito (data)
 */
lib.create = function(dir, file, data, callback) {
	var filePath = lib.baseDir + dir + '/' + file + '.json';
	fs.open(filePath, 'wx', function(err, fileDescriptor) {
		if (!err && fileDescriptor) {
			// convertir data a string
			var stringData = JSON.stringify(data);

			// Escribir data en el archivo (fileDescriptor)
			fs.writeFile(fileDescriptor, stringData, function(err) {
				if (err) {
					callback('Error writting to a new file');
				} else {
					fs.close(fileDescriptor, function (err) {
						if (err) {
							callback('Error closing new file');
						} else {
							callback(false);
						}
					});
				}
			});
		} else {
			callback('Error: Could not create a new file, already exist o there is not such directory');
		}
	});
};
```

### Leer archivo
Nota: si no se coloca `utf8` en la funcion `readFile` retornara la data en formato Binario.
```js
/*
 * Description: Read a File
 * @param {string} dir - nombre del directorio
 * @param {string} file - nombre del archivo
 * @param {function} callback - function que retorna error o exito (data)
 */
lib.read = function(dir, file, callback) {
	var builtPath = lib.baseDir + dir + '/' + file + '.json';
	fs.readFile(builtPath, 'utf8', function (err, fileData) {
		callback(err, fileData);
	})
};
```
### Actualizar archivo
Para actualizar un archivo utilizaremos el metodo `fs.truncate`. Este metodo se usa para cambiar el tamano del archivo.

Si el metodo fue exitoso, entonces podremos guardar la nueva informacion en el archivo con el metodo `fs.writeFile` (ver Crear archivo).
```js
lib.update = function(dir, file, data, callback) {
	var builtPath = lib.baseDir + dir + '/' + file + '.json';
	fs.truncate(builtPath, function(err) {
		if (err) {
			callback('Error truncating the file');
		} else {
			var stringData = JSON.stringify(data);
			fs.writeFile(builtPath, stringData, function(err) {
				if (err) {
					callback('Error updating file');
				} else {
					callback(false);
				}
			})
		}
	})
};
```

### Crear ruta para USERS
En esta seccion crearemos toda la logica para Crear, Leer, Actualizar y Eliminar un determinado usuario. Los pasos para conseguir esto son:
1.Crear la ruta *users* en el objeto `routes` del servidor.
```js
const routes = {
	'ping': handlers.ping,
	'sample': handlers.sample,
	'users': handlers.users,
	'tokens': handlers.tokens,
}
```
2.Mover todos los `handlers` a un archivo propio dentro del directorio `lib`
3.Crear el `handler.users`
	3.1.Validar que el metodo de la solicitud sea alguno de estos: ['get', 'post', 'put', 'delete'].
4.Crear los cuatro handlers para `users`: POST, GET, PUT y DELETE
```js
const _user = require('.../users');

handlers.users = function(data, callback) {
	var validMethods = ['get', 'post', 'delete', 'put'];

	if (validMethods.indexOf(data.method) > -1) {
	// usar un sub-handler para manjear todas las logicas del CRUD
		_users[data.method](data, callback);
	} else {
		callback(405, { error: 'Method not allowed' });
	}
}
```
5.POST:
	5.1 Validar los campos entrantes para que cumplan con los tipos de variables requeridos. Todos son requeridos.

	```js
	var firstname = typeof data.payload.firstname === 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
	var lastname = typeof data.payload.lastname === 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
	var password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
	var tosAgreement = typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement === true ? true : false;
	```
	5.2 Si alguno no existe entonces retornar un error en el callback con un statusCode de 404
	5.3 Si todos cumplen entonces usar el phone para vericar si ya existe el registro. 

	```js
		lib.read('users', phone, function(err) {})
	```
	5.4 Si ya existe entonces retornar un error por el callback con statusCode 400 diciendo que el usuario ya existe
	5.5 Si no existe entonces encriptar el password. Crear una funcion en *lib* que lo haga.

	```js
	const passwordHashed = helpers.hash(password);
	...
	helpers.hash = function(str) {
		if (typeof str === 'string') {
			var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
			return hash;
		} else {
			return false;
		}
	}
	```
	5.6 Crear un objeto con los datos del usuario (incluyendo el password encriptado) y formatearlo con JSON.stringify
	5.7 Guardar la informacion -> usar lib.create('users', phone, userDataParsed, callback)
	5.8 Si el callback retorno error, entonces enviar statusCode 500
	5.9 Si no hay errores entonces enviar statusCode 200 o 201

	```js
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
	```
6.GET
7.PUT
8.DELETE

### Crear ruta para Manejar TOKENS
Usar el mismo esquema anterior para este caso.
 - Una vez creados los manejadores (handlers) es necesario crear una funcion que verifique que el token entrante es valido
 - Implementar la validacion del token dentro de cada manejador de User para que solo los usuarios autenticados puedan acceder

