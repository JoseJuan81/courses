> referencia: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

Correr MONGODB como servicio:
`
	brew services start mongodb-community@4.4
`
despues de ejecutar este comando podemos usar `mongo` y conectarnos.

detener MONGODB como servicio:
`
brew services stop mongodb-community@4.4
`
comando para conexion por terminal
`
mongo "mongodb+srv://sanbox.a2gg6.mongodb.net/admin" --username M001-student
`
posteriormente agregar password: `m001-mongodb-basics`
