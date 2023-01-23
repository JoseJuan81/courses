# Facet $bucketAuto
Permite agrupar los documentos entrantes basado en el campo especificado y el número de rangos.

El resultado tiene dos campos, `_id` y `count`. El `_id` corresponde al rango.

[mas](https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucketAuto/)

```bash
{
  $bucketAuto: {
    groupBy: <expression>,
    buckets: <number>,
    output: {
      <output1>: { <$accumulator expression> },
      ...
    }
    // el output es igual a $bucket
    granularity: <string>
  }
}
```
#### Pipe aggregation
```bash
db.companies.aggregate( [
    { $match: { 'offices.city': 'New York' } },
    { $bucketAuto: {
        groupBy: 'founded_year',
		    buckets: 5
    }}
])
```

#### Resultado
```bash
[
    { "_id" : { "min": null, "max": 1994 }, "count" : 5447 },
    { "_id" : { "min": 1994, "max": 2003 }, "count" : 1172 },
    { "_id" : { "min": 2003, "max": 2007 }, "count" : 652 },
    { "_id" : { "min": 2007, "max": 2009 }, "count" : 738 },
]
```
