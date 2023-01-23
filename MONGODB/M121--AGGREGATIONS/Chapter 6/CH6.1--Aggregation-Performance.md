# Aggregation Performance
- Index Usage
- Memory Constraints

## Index Usage
Usar index en las consultas reduce considerablemente el tiempo de respuesta sin embargo no todos los operadores de `aggregate` lo aceptan.
Si uno de los `stage` de la pipeline no usa index entonces ninguno de los siguientes `stage` podra usarlo por tanto, los `stage` que permiten index deben ser los primeros.

```bash
db.orders.aggregate([
    { $match: { cust_id: { $lt: 50 } } },
    { $limit: 10 },
    { $sort: { cust_id: 1 } },
])
```
- $match acepta index y por ello se recomienda sea el primer `stage` o uno de los primeros
- $limit como uno de los primeros `stage` de la pipeline y posteriormente $sort, permite que el servidor ajuste la memoria que usa a la cantidad de documentos ( en este caso 10 documentos ). A esto se le llama `top-k sorting` y permite gran optimización independientemente del index.
- Usar $sort como uno de los primeros `stage` después de filtrados ($match). Lo recomendable es que $sort esté antes de cualquier tipo de transformación de data.
## Memory Constraints
- El resultado de una pipeline está restringido a 16MB. Es importante aclarar que mientras el documento esté pasando por la pipeline puede superar los 16MB pero al final no.
- Para reducir el tamaño del documento se usan: `$limit` y `$project`
- Cada `stage` de la pipeline tiene un límite de 100MB de RAM. Usar index en los primeros `stage` permite reducir el uso de memoria.
- En caso se requiera más de 100MB de RAM se puede usar `{ allowDiskUse: true }` sin embargo esto reduce el rendimiento considerablemente por lo que debe ser la última opción.
- `$graphLookUp` y `{ allowDiskUse: true }` no trabajan juntos ya que el primero no permite la partición del disco ( al usar `{ allowDiskUse: true }` el disco se divide.)