const lib = require("../../lib");
const helpers = require("../helpers");

const tokens = {};
// Required data: phone number and password
tokens.post = function(data, callBack) {

    var password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone.trim() : false;
    
    if ( password && phone ) {

        // buscar el usuario que tiene este phone
        lib.read( 'users', phone, function( err, userData ) {

            if( !err && userData ) {

                const user = JSON.parse( userData );
                // Comparar las contrasenas para garantizar que es el usuario correcto
                const hashedPassword = helpers.hash( password );

                if ( hashedPassword === user.password ) {

                    const tokenId = helpers.createRandomString( 20 );

                    if ( tokenId ) {

                        // Token expira en 1 hora
                        const expires = Date.now() + ( 1000 * 60 * 60 );
    
                        const tokenObject = {
                            id: tokenId,
                            expires,
                            phone
                        }
    
                        lib.create( 'tokens', tokenId, tokenObject, function( err ) {
    
                            if ( !err ) {
    
                                callBack( 200, tokenObject );
                            } else {
    
                                callBack( 500, { Error: 'No se pudo crear el archivo con el token' } )
                            }
                        })
                    } else {

                        callBack( 500, { Error: 'No fue posible generar el registro' } )
                    }
                } else {

                    callBack( 400, { Error: 'Las contrasenas no coinciden' } )
                }
            } else {

                callBack( 400, { Error: 'No existe usuario asociado a ese numero de telefono' } )
            }
        })

    } else {
        callBack( 400, { Error: 'Faltan campos requeridos' } )
    }

}

// Required data: id
tokens.get = function(data, callback) {
    // del query string obtener el id
	var id = data.queryStringObject.id;

	// validar variable phone
	const validId = typeof id === 'string' && id.trim().length === 20 ? id.trim() : false;

	if (validId) {
        // verificar que exista ese phone. Buscar el archivo en el registro
		lib.read('tokens', validId, function(err, tokenData) {
			if (!err && tokenData) {
				const tokenObject = JSON.parse( tokenData );
				callback(200, tokenObject);
			} else {
				callback(404, { error: 'token does not exist' });
			}
		})
	} else {
		callback(400, { error: 'Missing required field id' });
	}
}

// Required data: id and exttend
tokens.put = function(data, callBack) {

    const id = data.payload.id;
    const extend = data.payload.extend;

    const validId = typeof id === 'string' && id.trim().length === 20 ? id.trim() : false;
    const validExtend = typeof extend === 'boolean' && extend === true;

    if ( validId && validExtend ) {

        // buscar la informacio del token con este id
        lib.read( 'tokens', id, function( err, tokenData ) {

            if ( !err && tokenData ) {

                const tokenObject = JSON.parse( tokenData );

                // Verificar que el token no haya expirado
                if ( tokenObject.expires >= Date.now() ) {

                    tokenObject.expires = Date.now() + ( 1000 * 60 * 60 );

                    lib.update( 'tokens', id, tokenObject, function( err ) {

                        if ( !err ) {

                            callBack( 200 );
                        } else {
                            
                            callBack( 500, { Error: 'No fue posible actualizar el registro del token' } );
                        }
                    })
                } else {

                    callBack( 404, { Error: 'Su token ya expiro' });
                }
                
            } else {

                callBack( 404, { Error: 'No existe token con ese id' })
            }
        })
    } else {

        callBack( 404, { Error: 'Los campos son requeridos: id y extend' })
    }
}

tokens.delete = function(data, callBack) {
    // del query string obtener el id
	var id = data.queryStringObject.id;

	// validar variable phone
	const validId = typeof id === 'string' && id.trim().length === 20 ? id.trim() : false;

	if (validId) {

        lib.delete( 'tokens', id, function( err ) {

            if ( !err ) {

                callBack( 200, { Success: 'Token eliminado' } );
            } else {

                callBack( 500, { Error: 'No fue posible eliminar el token' })
            }
        })

    } else {

        callBack( 404, { Error: 'El id es requerido o el suministrado no es valido' })
    }
}

tokens.verifyToken = function( token, phone, callback ) {
    
    lib.read( 'tokens', token, function( err, tokenData ) {

        if ( !err && tokenData ) {
            const tokenObject = JSON.parse( tokenData );

            if ( tokenObject.phone === phone && tokenObject.expires > Date.now() ) {

                callback( true );
            } else {

                callback( false );
            }
        } else {

            callback( false );
        }
    })
}

module.exports = tokens;