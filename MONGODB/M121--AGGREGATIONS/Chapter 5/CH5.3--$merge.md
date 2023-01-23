# $merge
Es la última etapa de la pipeline y permite mezclar la información de salida de la aggregation pipeline en una colección existente en la misma base de datos u otra.

[mas](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/)
```bash
{
    $merge: {
        into: <target>,
        on: <fields>
        whenNotMatched: "insert" (por defecto) | "discard" | "fail",
        whenMatched: "merge" (por defecto) | "replace" | "keepExisting" | "fail" |
    }
}
```