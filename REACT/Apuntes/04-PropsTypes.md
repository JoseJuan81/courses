# Props types

Se trata de un modulo de `React` para validar los tipos de variables que se pasan como `props`

```js
import React from 'react';
import PropTypes from 'prop-types';

export const PrimeraApp = ({ saludo, resultado }) => {

    return (
        <>
            <h1>{ saludo }</h1>
            <p>{ resultado </p>
        </>
    );
}

PrimeraApp.propTypes = {
    saludo: PropTypes.string.isRequired,
    resultado: PropTypes.number.isRequired
}
```