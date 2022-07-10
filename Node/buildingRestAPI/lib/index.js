/*
 * Library for storing and editing data
 */

// Dependencies
var fs = require('fs');
var path = require('path');

// Container for the module to be exported
var lib = {};

// ruta directa a directorio .data
// __dirname es la ruta al directorio donde estamos
lib.baseDir = path.join(__dirname, '/../.data/');

/*
 * Description: Create File
 * @param {string} dir - nombre del directorio
 * @param {string} file - nombre del archivo
 * @param {any} data - Informacion a guardar en el archivo
 * @param {function} callback - function que retorna error o exito (data)
 */
lib.create = function(dir, file, data, callback) {
	var filePath = lib.baseDir + dir + '/' + file + '.json';

	// fs.open retorna un `fd` (file descriptor) y por tal motivo al final debemos ejecutar fs.close.
	// Los metodos fs.readFile, fs.writeFile y fs.appendFile no retornan `fd` y no necesitan el metodo fs.close
	// 'wx' es una directiva para: abrir el archivo. Si no existe, lo crea y si existe retorna un error.
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
			callback('Error: Could not create a new file, already exist or there is not such directory');
		}
	});
};

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

/*
 * Description: Update File
 * @param {string} dir - nombre del directorio
 * @param {string} file - nombre del archivo
 * @param {any} data - Informacion nueva a guardar en el archivo
 * @param {function} callback - function que retorna error o exito (data)
 */
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

/*
 * Description: Delete a File
 * @param {string} dir - nombre del directorio
 * @param {string} file - nombre del archivo
 * @param {function} callback - function que retorna error o exito (data)
 */
lib.delete = function(dir, file, callback) {
	var builtPath = lib.baseDir + dir + '/' + file + '.json';
	fs.unlink(builtPath, function(err) {
		if (err) {
			callback('Error deleting a file');
		} else {
			callback(false);
		}
	})
};

lib.list = function (dir, callback) {
	fs.readdir(lib.baseDir + dir + '/', function(err, data) {
		if (!err && data && data.length > 0) {
			var trimmedFilesNames = [];
			data.forEach(function(fileName) {
				var onlyName = fileName.replace('.json', '');
				trimmedFilesNames.push(onlyName);
			})

			callback(false, trimmedFilesNames);
		} else {
			callback(err, data);
		}
	})
}

module.exports = lib;
