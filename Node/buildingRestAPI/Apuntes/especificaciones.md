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