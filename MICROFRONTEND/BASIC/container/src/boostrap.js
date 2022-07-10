
// con esta sentenca le decimos a webpack y a modulefederation cual modulo solicitar
import { mount } from 'productsRemoteModule/ProductsIndex';
import { mountCart } from  'cartRemoteModule/CartIndex';

const productContainer = document.querySelector('#products-container');
const cartContainer = document.querySelector('#cart-container');

if ( productContainer ) {

    mount( productContainer );
}

if ( cartContainer ) {
    mountCart( cartContainer );
}

console.log('container')