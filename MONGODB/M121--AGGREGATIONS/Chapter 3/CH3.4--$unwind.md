# $unwind
`$unwind` es un stage que solo trabaja sobre campos de tipo arreglo y lo que hace es que utiliza los datos del arreglo para generar nuevos documentos.
Si un documento en particular tiene un arreglo con dos elementos en el campo X, entonces `$unwind` generará dos documentos, uno para cada elemento del campo X.

[mas](https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/)

### Importante
- Cuando se trabajan con colecciones de documentos grandes, es posible consumir la memoria disponible para la pipeline, por tal motivo se recomienda filtrar lo más que se pueda antes de utilizar `$unwind`.
- Existen dos formas de utilizar `$unwin`, la corta y la larga
```bash
$unwind: <field path>
```
```bash
$unwind: {
    path: <field path>
    includeArrayIndex: <string>
    preserveNullAndEmptyArrays: <boolean>
}
```

### Ejemplo
Aplicar `$unwind` al siguiente documento
```bash
{
    title: "The Martian",
    genres: ["Action", "Adventure", "Comedy"]
}
```
Resultado después de aplicar `$unwind`
```bash
{
    title: "The Martian",
    genres: "Action"
},
{
    title: "The Martian",
    genres: "Adventure"
},
{
    title: "The Martian",
    genres: "Comedy"
}
```