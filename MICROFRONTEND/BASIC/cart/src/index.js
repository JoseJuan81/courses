// es necesario hacer esto para darle la oportunidad a webpack de cargar el modulo Faker
// de forma asyncrona y esto ocurre siempre que se comparten modules entre proyectos
// en este caso se comparte el modulo faker ( shared: ['faker'] )
import('./boostrap');