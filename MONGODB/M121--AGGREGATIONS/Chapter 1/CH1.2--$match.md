# Match
`$match` es uns estado de "filtrado" de documentos y es altamente recomendable que sea el primero o uno de los primeros `stages` de nuestra `pipeline`
> `$match` usa la misma sintaxis de consulta que `.find`

### Limitaciones
- No es posible utilizar el operador `$where`
- Si queremos usar el operador `$test` entonces, obligatoriamente, `$match` debe ser el primer `stage`
- `$match` no permite el uso de `projection` ( decidir cuales campos son retornados o no de la consulta)