import faker from 'faker';

// crear funcion mount para no estar atado al id ( dev-products ) de la etiqueta <div></div>
const mount = ( el ) => {

    let products = '';

    for ( let i = 0; i < 15; i += 1 ) {
        
        const name = faker.commerce.productName();

        products += `<div>${ name }</div>`
    }

    el.innerHTML = products;
}

// preguntar si el ambiente es desarrollo
if ( process.env.NODE_ENV === 'development' ) {

    // con esto determino si estoy trabajando solo con este modulo
    // porque pudiera estar usando desde el container
    // el id dev-products--in-isolation solo lo tiene la etiqueta <div></div>
    // de este modulo ( products ) mientras que container no lo tiene.
    const ele = document.querySelector('#dev-products--in-isolation');
    if ( ele ) {
        mount( ele );
    }
}

export { mount };
