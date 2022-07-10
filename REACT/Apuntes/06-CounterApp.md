# useState Hook

El useState se usa para tener estados en el componente.

existen dos formas de usarlo:
1. Pasando de argumento el valor a establecer
```js
setCounter(counter + 1)
```
2. Pasando una funcion que tendra como argumento el valor actual. Esta sintaxis se usa cuando no es posible tener acceso al valor de la variable.
```js
setCounter((c) => c + 1)
```

```js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const CounterApp = () => {
    const [counter, setCounter] = useState(0)

    const handleClick = () => {
        setCounter(counter + 1)
        setCounter((c) => c + 1)
    }

    return (
        <>
            <h1>CounterApp</h1>
            <p>{ counter }</p>

            <button onClick={ handleClick }>+1</button>
        </>
    );
}
```