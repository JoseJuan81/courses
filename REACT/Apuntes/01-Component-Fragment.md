# Retornar Elementos en el Componente - Fragment

### Fragment
es un elemento de React usado para no agregar una etiqueta "padre". Se usa en los componentes creados, de lo contrario es necesario usar una etiqueta padre que por lo general es un `div`

```js
import React, { Fragment } from 'react';

export const PrimeraApp = () => {
    return (
        <Fragment>
            <h1>Hola Mundo</h1>
            <p>Mi primera aplicacion</p>
        </Fragment>
    );
}
```
la forma corta es la siguiente:

```js
import React from 'react';

export const PrimeraApp = () => {
    return (
        <>
            <h1>Hola Mundo</h1>
            <p>Mi primera aplicacion</p>
        </>
    );
}
```