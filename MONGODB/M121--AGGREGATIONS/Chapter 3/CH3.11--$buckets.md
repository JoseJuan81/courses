# Facet $bucket
Permite agrupar los documentos entrantes basado en el campo especificado y los rangos definidos.

El resultado tiene dos campo, `_id` y `count`.

[mas](https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket)

```bash
{
  $bucket: {
      groupBy: <expression>,
      boundaries: [ <lowerbound1>, <lowerbound2>, ... ],
      default: <literal>,
      output: {
         <output1>: { <$accumulator expression> },
         ...
         <outputN>: { <$accumulator expression> }
      }
   }
}
```
#### Pipe aggregation
```bash
db.companies.aggregate( [
    { $match: { 'founded_year': { $gte: 1980 } } },
    { $bucket: {
        groupBy: 'number_of_employees',
        boundaries: [0, 2, 10, 20, 50, 100, Infinity],
        default: 'Others'
    }}
])
```

#### Resultado
```bash
[
    { "_id" : 0, "count" : 5447 },
    { "_id" : 20, "count" : 1172 },
    { "_id" : 50, "count" : 652 },
    { "_id" : 100, "count" : 738 },
    { "_id" : "Others", "count" : 2222 },
]
```

## Ejemplo #2
```bash
db.artists.insertMany([
  { "_id" : 1, "last_name" : "Bernard", "first_name" : "Emil", "year_born" : 1868, "year_died" : 1941, "nationality" : "France" },
  { "_id" : 2, "last_name" : "Rippl-Ronai", "first_name" : "Joszef", "year_born" : 1861, "year_died" : 1927, "nationality" : "Hungary" },
  { "_id" : 3, "last_name" : "Ostroumova", "first_name" : "Anna", "year_born" : 1871, "year_died" : 1955, "nationality" : "Russia" },
  { "_id" : 4, "last_name" : "Van Gogh", "first_name" : "Vincent", "year_born" : 1853, "year_died" : 1890, "nationality" : "Holland" },
  { "_id" : 5, "last_name" : "Maurer", "first_name" : "Alfred", "year_born" : 1868, "year_died" : 1932, "nationality" : "USA" },
  { "_id" : 6, "last_name" : "Munch", "first_name" : "Edvard", "year_born" : 1863, "year_died" : 1944, "nationality" : "Norway" },
  { "_id" : 7, "last_name" : "Redon", "first_name" : "Odilon", "year_born" : 1840, "year_died" : 1916, "nationality" : "France" },
  { "_id" : 8, "last_name" : "Diriks", "first_name" : "Edvard", "year_born" : 1855, "year_died" : 1930, "nationality" : "Norway" }
])
```
### Pipeline
```bash
db.artists.aggregate( [
  {
    $bucket: {
      groupBy: "$year_born",
      boundaries: [ 1840, 1850, 1860, 1870, 1880 ],
      default: "Other",
      output: {
        "count": { $sum: 1 },
        "artists" :
          {
            $push: {
              "name": { $concat: [ "$first_name", " ", "$last_name"] },
              "year_born": "$year_born"
            }
          }
      }
    }
  },
  {
    $match: { count: {$gt: 3} }
  }
] )
```

### Resultado
```bash
{ "_id" : 1840, "count" : 1, "artists" : [ { "name" : "Odilon Redon", "year_born" : 1840 } ] }
{ "_id" : 1850, "count" : 2, "artists" : [ { "name" : "Vincent Van Gogh", "year_born" : 1853 },
{ "name" : "Edvard Diriks", "year_born" : 1855 } ] }
{ "_id" : 1860, "count" : 4, "artists" : [ { "name" : "Emil Bernard", "year_born" : 1868 },
{ "name" : "Joszef Rippl-Ronai", "year_born" : 1861 },
{ "name" : "Alfred Maurer", "year_born" : 1868 },
{ "name" : "Edvard Munch", "year_born" : 1863 } ] }
{ "_id" : 1870, "count" : 1, "artists" : [ { "name" : "Anna Ostroumova", "year_born" : 1871 } ] }
```