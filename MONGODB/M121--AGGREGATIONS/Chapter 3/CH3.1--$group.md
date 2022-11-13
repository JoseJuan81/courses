# $group
`$group` es un stage que permite agrupar los documentos por uno de sus campos. Para ello se define el campo en la variable `_id`

```bash
{ $group: { _id: "name" } }
```
En este caso se agrupan los documentos por el valor de `name`.
```bash
{ $group: { _id: null } }
```
En este caso se agrupan todos los documentos.

> $group puede ser utilizado más de una vez en la pipeline
