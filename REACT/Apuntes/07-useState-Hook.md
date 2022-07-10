# Crear Componente CounterApp

Usar el snippet `rafcp` para tener una estructura por defecto con `propTypes` como la de abajo.
Por defecto el snipet asignara el nombre del archivo al componente

```js
import React from 'react';
import PropTypes from 'prop-types';

export const CounterApp = ({ value }) => {

    return (
        <>
            <h1>CounterApp</h1>
            <p>{ value }</p>
        </>
    );
}

PrimeraApp.propTypes = {
    value: PropTypes.number.isRequired
}

PrimeraApp.defaultProps = {
    value: 123
}
```