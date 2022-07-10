# Default Props

Se trata del valor por defecto que deben tener las propiedades de un componente

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

PrimeraApp.defaultProps = {
    saludo: 'Hola mundo',
    resultado: 123
}
```

```js
import PrimeraApp from './components/PrimeraApp';

export const PaginaIndex = () => {

    return (
        <>
            <PrimeraApp />
        </>
    );
}
```