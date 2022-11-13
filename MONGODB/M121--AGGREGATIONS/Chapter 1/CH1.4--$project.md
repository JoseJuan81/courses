# Project
`$project` es un `stage` que permite remover, agregar o reasignar campos.
>Las modificaciones mencionadas no las hace al documento ya que aggregate no modifica el documento original.

```bash
db.solarSystem.aggregate([
    { $project: { _id: 0, name: 1 } }
])
```
En este caso, con el `$project` se está removiendo el campo `_id` y se mantiene `name`

```bash
db.solarSystem.aggregate([
    { $project: {
        _id: 0,
        name: 1,
        myWeight: { $multiply: [{ $divide: ["gravity.value", 9.8] }, 68] }
    }}
])
```
> Con esta sentencia estamos creando un campo nuevo llamado `myWeight` que calcula mi peso en cada planeta del sistema solar. El campo `myWeight` es un campo calculado en el que 68 es mi peso en la tierra, 9.8 la gravedad de la tierra y `"gravity.value"` es la gravedad en cada planeta o estrella del sistema solar.

