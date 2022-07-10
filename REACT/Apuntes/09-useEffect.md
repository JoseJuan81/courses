# UseEffect

### Para que el `useEffect` se ejecute con cada renderizado
```js
useEffect(() => {

})
```

### Para que el `useEffect` se ejecute con el primer renderizado nada mas
```js
useEffect(() => {

}, [])
```

### Para que el `useEffect` se ejecute solo cuando la dependencia cambia
```js
useEffect(() => {

}, [miDependencia])
```