import faker from 'faker';

const cartText = `<div>Tienes ${ faker.datatype.number() } articulos</div>`;

const mountCart = ( el ) => {

    el.innerHTML = cartText;
}

if ( process.env.NODE_ENV === 'development') {

    const ele = document.querySelector('#dev-cart--in-isolation');

    if ( ele ) {
        mountCart( ele );
    }
}

export { mountCart }

