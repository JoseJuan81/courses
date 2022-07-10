# NODE MASTER CLASS

### NOTA

	fs.truncate => fs.ftruncate
	No native TS
	https://deno.land/ es como *node* pero más parecido al ambiente del navegador y soporta typescript

## historia

	*node*.js es creado en 2009 por **ryan dahl** y para este momento era una versión inestable y con errores. los desarrolladores del momento no le prestaron atención a este proyecto.
	a finales del 2010 y en el 2011 es cuando *node* empieza a tener relevancia gracias a npm, express, mongodb y angular:

### npm

npm es un programa creado para compartir codigo. Tiene todo un sistema sencillo para poder instalar codigo de terceros y esta caracteristica catalpultó el uso de *node*. los desarrolladores se dieron cuenta que no necesitaban hacer todo de nuevo, en lugar de ello, creaban una funcionalidad que, a traves de npm, reusan en cualquier proyecto node o compartian con otros.

### express

express creó una capa que facilitaba el uso de *node* y era más estable que este. tenía menos errores y los mismos eran faciles de resolver. Los desarrolladores no invertian tanto tiempo entendiendo o decifrando los problemas. Por otro lado, express brindaba una usabilidad mejor que node.

### mongodb y las redes sociales (twitter)

La base de datos *no-relacional* jugo un papel interesante en la historia de *node* ya que ambos proyectos no eran atractivos para los desarrolladores del momento. para ese entonces ya existian tecnologias que trabajaban juntas: ruby y postgress, php y mysql. El cambio de paradigma que planteaba *mongodb* no atrajo a los desarrolladores hasta el surgimiento de las redes sociales cuando twitter nace usando *mongodb* como base de datos y esto vuelca el interes sobre esta tecnologia y sobre node.

mongodb usa objetos json como datos y *node* presentaba mejor rendimiento y mayor sencilles en su tratamiento en comparacion con las otras tecnologias gracias a que usa javascript como lenguaje.

### angular

angular era el eslabon que faltaba: frontend. nace el stack mean = mongoose + express + angular + *node*

### v8
	lenguaje de máquina vs lenguaje humano.
	lenguaje máquina es binario: ceros y unos.
	lenguaje humano es el que hacemos: php, javascript, c++, etc. también se le conoce como lenguaje de alto nivel.

	las máquinas no entienden el lenguaje humano ni viceversa, entonces, ¿cómo es que nuestro lenguaje puede ser ejecutado por una computadora si no lo entiende?
	entre el lenguaje humano y el de la máquina existen otros programas que lo adaptan, transforman e interpretan:

### Interpreters

son como los compiladores pero no generan ningún archivo ejecutable. Los intérpretes toman el código fuente y lo convierten a lenguaje máquina para ejecutarlo inmediatamente después, no producen archivos ejecutables al final del proceso.

### transpiladores

toman el código y generan el mismo código pero con otro tipo (tipo hace mención a los tipos de variables) ej. sass a ccs, coffescript a javascript

### compiladores

convierten nuestro código a uno entendible y ejecutable por la máquina. Los compiladores generan ejecutables que son archivos con código ejecutable por la computadora.

Con estos conceptos claros podemos decir entonces que *v8* es un intérprete para javascript usado por chrome (google) y *node*. v8 toma el código javascript y lo convierte a código máquina, lo optimiza y finalmente lo ejecuta.
existen otros intérpretes para javascript como:
	- javascriptcore: usado por safari y reactnative
	- spidermonkey: usado por firefox. Este intérprete fue creado en 1996 por el mismo creador de javascript cuando trabajaba en netscape. Lo creó para ser usado internamente en el sistema web de navegación de netscape.
	- chakra: usado por internet explore
	- v8: usado por chrome y creado por google.

chrome es una aplicación creada sobre v8 (el intérprete javascript) y *node* es otra aplicación creada sobre la misma base. Ambos hacen los mismo, envían a v8 los archivos javascript para que sean interpretados (compilados y ejecutados)


¿QUE ES *NODE* EXACTAMENTE?
	es un ambiente de ejecucion de javascript del lado servidor que utiliza v8 como interprete. Una analogia para enterderlo mejor es: v8 es el motor y la transmision del carro y *node* es todo lo demas (sistemas hidraulicos, filtros, puertas, carroceria, ruedas, etc.) mientras que el conductor somo nosotros, los desarroladores.

	este "ambiente de ejecucion" es conocido como "javascript runtime enviroment" y es quien decide cuales archivos o comandos deben ser ejecutados y cuando para luego enviarlos a v8 engine para que los ejecute en la computadora y posteriormente manejar las respuestas. *node* es una especie de administrador: mira los archivos js y comandos, empaqueta, importa, exporta archivos, delega tareas, trata respuestas, etc. 

	*node* es una aplicacion maestra creada en c++ que tiene embebido v8. el termino "aplicacion maestra" es porque esta compuesta por 2 aplicaciones:
1. el procesador de script (script processor)
2. REPL (Read Execution Print Loop)

### 1.SCRIPT PROCESSOR (PROCESADOR DE SCRIPT)

	es la interface que se muestra cuando escribimos "*node*" en la terminal.
	si escribimos "*node* index.js" entonces node abrira el archivo index.js y procesara los comandos que contiene pero ¿como lo hara?. 
		1 Inicia un proceso llamado "event loop"
		2 Procesa el archivo js. Envia a V8 el codigo sincrono para su ejecucion mientras que el asincrono que en espera.
		3 El "EVENT LOOP" inicializado anteriormente le informa a *node* que hay tareas pendientes para su ejecucion (codigo asincrono finalizado).
	este "event loop" es un bucle infinito que verifica si hay algo pendiente por ejecutar,......¿¿¿¿¿¿¿¿?????????
	aqui nos preguntamos, "¿cosas pendientes por ejecutar?, pero el paso 2 proceso el archivo js, ¿que mas queda pendiente?".

	es ahora que *node* se pone interesante: SINCRONO y ASINCRONO

### SINCRONO

Es el procesamiento inemdiato del codigo. Cuando *node* lee, procesa y envia el codigo al V8 para su ejecucion.

### ASINCRONO

Cuando *node* delega el trabajo a alguien mas. *Node* tiene la capacidad de decidir si procesa o delega el codigo que esta leyendo y de esta manera evitar bloqueos.
El proceso, de forma generalizada, seria asi:

	1 Inicia el proceso: "EVENT LOOP"
	2 Procesa el archivo js para decidir cual codigo va a ejecutar y cual va a delegar.
	3 Ejecuta el codigo SINCRONO y delega el ASINCRONO.
	4 El "EVENT LOOP", que es un bucle, verifica si existe algun codigo por procesar que en nuestro caso seria el codigo delegado que ha retornado.

¿que sucede cuando existen muchas tareas delegadas?
Para esto, *node* tiene el QEUE: sistema de "cola" para ejecutar el codigo retornado. Las tareas delegadas no necesariamente retornaran en el mismo orden en que fueron delegadas por cada una tiene su propio tiempo de procesamiento y tampoco seran ejecutadas apenas retornen, deben esperar que el proximo EVENT LOOP las ejecute y mientras tanto deben "hacer su cola". El EVENT LOOP se ejecutara de forma automatica siempre y cuando existan tareas en la "cola" (qeue).

Esta combinacion de procesos SINCRONOS y ASINCRONOS dan la ilusion de que *node* ejecuta varias tareas de forma simultanea pero la realidad es que no lo hace. *Node* es un sistema de "UN SOLO HILO DE EJECUCION", es decir, solo es capaz de ejecutar una tarea a la vez pero con una muy buena estrategia NON-BLOCKING, por esta razon es capaz de manejar altas concurrecias o trafico en las aplicaciones, por ejemplo:

	Una solicitud de "Crear un nuevo usuario" llega a *Node* e inmediatamente despues llega otra solicitud de "Listado de usuarios". *Node* no espera a terminar el proceso de la primera solicutd para continuar con la segunda, en lugar de eso, delega la primera solictud y atiende la segunda para darse cuenta que tambien debe ser delegada. El "EVENT LOOP" se encarga de leer las tareas asincronas que retornaron (crear usuario y listado de usuario) y que estan en cola esperando ser culminadas por *Node* ( para efector del ejemplo, lo que queda pendiente es retornar el resultado de la BD a quien hizo la solicitud).

Nota Aclaratoria:
El uso de la palabra "delegar" solo es con fines pedagogicos ya que realmente *Node* no delega las tareas solo ejecuta un sistema que permite aprovechar mejor el tiempo. La idea de usar esta palabra es para generar la idea de continuidad en el proceso sin embargo, lo que realmente sucede es que *Node* no espera que las consultas a la BD finalicen para continuar con la ejecucion, el tiempo que tarda la consulta *Node* lo usa para procesar nuevas tareas o ejecutar codigo SINCRONO y cuando las respuestas esten listas simplemente se almacenaran en un sistema de "cola" llamado QEUE (puede ser una lista de tareas pendientes) en espera del EVENT LOOP para que *node* responda la solicitud (retornar la respuesta a quien solicito).

### 2.REPL

Es como la consola del navegador. Se trata de una interface en la que se puede ejecutar el codigo javascript en tiempo real. Al abrir esta consola se pueden escribir sentencias y ejecutarlas inmediatamente contra el V8.
R: Read el codigo escrito por nosotros
E: Execute el codigo leido
P: Printing el resultado de lo ejecutado
L: Loop para repetir el proceso otra vez.

===============================================================
ANATOMIA DE UNA APLICACION EN NODE => Ver archivo nodeAppAnatomy.js

===============================================================
CONVENCIONES AL CREAR UNA APLICACION EN NODE

1. PACKAGE.JSON:
	Archivo que administra las dependencias instaladas en nuestro proyecto. Esta ubicado generalmente en la raiz del proyecto y contiene informacion clave del mismo como: nombre, descripcion, version, comandos ejecutables (script) y el listado de dependencias instaladas.

1.1 node_modules
	Con el comando npm install se instalan todas las dependencias listadas en la seccion "dependencies" en un directorio nuevo llamado "node_modules" del cual pueden ser requeridas en cualquier archivo del proyecto simplemente con el nombre de la dependenciam, ej: 
```js
// package.json
{
	...
	"dependencies": {
		"jokes": 0.0.2
	}
}
// index.js
const jokes = require('jokes');
```
1.2 package-lock.json
	Como vemos, no existe una ruta relativa al momento de requerir la dependencia o modulo "jokes" y es que por convencion, *Node* buscara dentro del directorio "node_modeules" este modulo (debido a que la ruta no es relativa).

	Al ejecutar "npm install" se genero automaticamente el archivo package-lock.json. Este archivo lleva el registro de las versiones exactas que han sido instaladas en el proyecto y las bloquea o asegura, es decir, si por algun motivo no existe coincidencia entre las versiones de una dependencia (entre el package.json y package-lock.json), npm install siempre instalara la indicada en el package-lock.json. Esto evita manipular las versiones directamente en el package.json y para actualizar o cambiar las versiones de nuestro proyecto debemos usar los comandos de "npm". 
1.3 .npmrc
	Este archivo permite guarfar una conexion con "npm" mediante una token para acceder a paquetes "privados".

1.4 Lugar para requerir los modulos
	Por convencion, el lugar para requerir los modulos es al comienzo de los archivos donde se usaran.

2. TESTING Y EJECUCION DE TAREAS
	Las pruebas son muy populares en los desarrolladores y en *node* no es la excepcion. Por convencion los archivos con las pruebas se localizan dentro de un directorio llamado "test" y en el package.json se define un comando (dentro de la seccion scrips) para ejectar estos archivos con un determinado "test runner" o ejecutador de pruebas.

	En proyectos grandes y/o complejos es normal conseguir estructuras de pruebas largas y con integraciones a otras plataformas. Es aqui donde aparece el concepto de CI/CD: sistema de pruebas y despliegue continuos. Existen aplicaciones como Travis.js que son configuradas para ejecutar nuestras pruebas y permitir que se depliegue nuevamente nuestra aplicacion si es que fueron exitosas.

3. DOCUMENTACION
	La documentacion de nuestro proyecto es una de las convenciones mas importantes ya que brinda directrices u orientaciones a otros desarrolladores sobre lo que hace nuestra aplicacion. Por convencion, la documentacion la podemos dividir en dos:
	- Archivo Readme.ms
	- Comentarios.

3.1 README.MD
	Se trata de una archivo que describe la finalidad del proyecto, tecnologias usadas, instrucciones de implementacion, preguntas frecuentes, etc. para que los usuarios puedan conoces el proyecto en poco tiempo.
	Este archivo por lo general esta ubicado en la raiz del proyecto y ciertas aplicaciones como GitHub y Npm lo muestran de forma automatica cuando un proyecto esta en ellos.

3.2 Comentarios
	Por convencion se estila agregar comentarios en cada archivo js y sobre cada funcion. Estos comentarios tienen cierta estructura que al cumplirla es posible generar posteriormente de forma automatica la documentacion del proyecto.
```js
/*
* @param {number} a - Numero a ser sumado
* @param {number} b - Numero a sumar
* @return {number} - Numero resultado
const sum(a, b) => a + b;
```
	Algunas de los comentarios mas usados son: @TODO, @param, @Author, @DATE.

4. CONFIGURACIONES Y AMBIENTE DE TRABAJO
	Las configuraciones por ambiente de trabajo son muy comunes en los desarrolladores que usan *node*. Los ambientes de trabajos son definidos gracias al uso de la variable NODE_ENV.
	Por lo general, NODE_ENV tiene tres valores:
	- NODE_ENV=development
	- NODE_ENV=production
	- NODE_ENV=test
	Cada ambiente de trabajo puede requerir una configuracion especial o no. Como se observa, se han definido ambientes para pruebas, para desarrollo y para produccion. Este ultimo corresponde a la configuracion de la app que ha sido desplegada para que los usuarios accedan.
	Para acceder a esta variable se usa: `process.env.NODE_ENV` desde cualquier parte de nuestra aplicacion *node*. Como parte de la convencion, es normal tener un archivo "config.js" en el que se definen las variables que seran exportadas de acuerdo al ambiente actual. Tambien es muy usual contar con un archivo `.env` que alojara todas las variables requeridas para el proyecto clasificadas por ambientes. Es importante indicar que por lo general estas variables tienen informacion sensible o delicada que no deben estar disponibles para acceso libre como por ejemplo claves de acceso a bases de datos, por eso debemos estar precavidos de incluir estos archivos en nuestro `.gitignore` de manera tal de evitar subirlos a github.

5. ESTILOS Y PATRONES
	Los desarrolladores usan convenciones de estilos y patrones para realizar codigo y para el caso de *node* existe una especificacion muy popular que la de "airbnb" que puede ser conseguida aqui: https://github.com/airbnb/javascript. Esta especificacion de estilos y patrones establece una serie de reglas que buscan realizar y mantener un codigo congruente entre los desarrolladores de un mismo proyecto.
	Adicionalmente a esta especificacion existen librerias, totalmente configurables, que estan pendiente de que cumplamos con los estilos y patrones definidos. Una de esas librerias es "Eslint" (https://eslint.org/). Eslint tiene una estrategia de indicarle al desarrollador donde no esta cumpliendo con lo especificado.

5. ERROR HANDLING
	Errback => popularizado por express, define al primer argumento del callback como el indicador del error.
	throw Exceptions => Evitar las excepciones en *node* a menos que sean necesarias ya que estas matan a la aplicacion. Como sabemos, una aplicacion en *node* siempre esta activa gracias al *event loop* y las excepciones cortan la ejecucion es este loop, es decir, "matan la aplicacion". Imaginemos que tenemos una aplicacion en production y multiples usuarios estan accediendo a ella. Si nuestra aplicacion maneja los errores con excepciones (uncaught exception) entonces cualquier error hara que todos los usuario dejen de usar la aplicacion mienstras que manejar los erroes de forma diferente permitira a los usuario seguir.

6. VARIABLES GLOBALES 
	Por convencion se estila no agregar variables de forma global en nuestra aplicacion a menos que sea estrictamente necesario, esto ya que en las apliaciones con *node* es normal usar modulos de otros y estos modulos pudieran tener variables globales que generarian conflictos con las nuestras. Por ello, una buena practica es manejar nuestras variables dentro del ambito de nuestra aplicacion o modulo.
