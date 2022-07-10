# Tipos de variables imprimibles en el DOM

`string`, `numbers`, `arrays`.

Los objetos seran imprimibles si:
- se usa `JSON.stringify(objeto)`
- se usa `JSON.stringify(objeto, null, 3)`

NOTA: Se puede usar la etquita `<pre>`

```js
import React, { Fragment } from 'react';

export const PrimeraApp = () => {
    const saludo = 'Hola Mundo';

    return (
        <>
            <h1>{ saludo }</h1>
            { /* <h1>{ JSON.stringify(saludo, null, 3 }</h1> */}
            <p>Mi primera aplicacion</p>
        </>
    );
}
```
las `{}`en el template permite el uso de expresiones JS que retorne un valor permitido (como los anteriormente mencionados)