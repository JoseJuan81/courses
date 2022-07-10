# Comunicacion entre Componentes - Props

Las `Props` es la forma comun de pasar informacion de un componente hijo a uno padre.

Todos los atributos que se agreguen al hijo estaran en `props` del padre

```js
import React, { Fragment } from 'react';

export const PrimeraApp = (props) => {

    return (
        <>
            <h1>{ props.saludo }</h1>
            { /* <h1>{ JSON.stringify(saludo, null, 3 }</h1> */}
            <p>Mi primera aplicacion</p>
        </>
    );
}
```

```js
import PrimeraApp from './components/PrimeraApp';

export const PaginaIndex = () => {

    return (
        <>
            <PrimeraApp saludo="Hola mundo" />
        </>
    );
}
```