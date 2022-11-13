# Múltiple Facet
Permite realizar múltiples Facets en una misma consulta. Esto es útil cuando se quieren mostrar varios datos filtrados, por ejemplo, en ecommerce. En este tipo de app existen múltiples filtros y los resultados de cada filtro muestran la cantidad.

[mas](https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet)

```bash
{ $match: { $text: { $search: 'Database' }}},
{
  $facet: {
    'Categories': [{ sortByCount: 'category_code'}],
    'Employees': [
      { $match: { founded_year: { '$gt': 1980 }}},
      { $bucket: {
        groupBy: '$number_of_employees',
        boundaries: [0, 20, 50, 100, 500, 1000, Infinity],
        default: 'Other'
      }}
    ],
    'Founded': [
      { $match: { 'offices.city': 'New York' }},
      { $bucketAuto: {
        groupBy: 'founded_year',
        bucket: 5
      }}
    ]
  }
}
```
Como se aprecia en el comando anterior, se han ejecutado los facets individuales de las secciones anteriores en una sola consulta, por tanto es posible generar varios facets a la vez y cada uno de ellos es independiente del otro. Esto quiere decir que el resultado de cada facets NO es usado en otro facets.
### Ejemplo
How many movies are in both the top ten highest rated movies according to the imdb.rating and the metacritic fields? We should get these results with exactly one access to the database.

```bash
db.movies.aggregate([
  {
    $match: {
      metacritic: { $gte: 0 },
      "imdb.rating": { $gte: 0 }
    }
  },
  {
    $project: {
      _id: 0,
      metacritic: 1,
      imdb: 1,
      title: 1
    }
  },
  {
    $facet: {
      top_metacritic: [
        {
          $sort: {
            metacritic: -1,
            title: 1
          }
        },
        {
          $limit: 10
        },
        {
          $project: {
            title: 1
          }
        }
      ],
      top_imdb: [
        {
          $sort: {
            "imdb.rating": -1,
            title: 1
          }
        },
        {
          $limit: 10
        },
        {
          $project: {
            title: 1
          }
        }
      ]
    }
  },
  {
    $project: {
      movies_in_both: {
        $setIntersection: ["$top_metacritic", "$top_imdb"]
      }
    }
  }
])
```
El $setIntersection permite conseguir las peliculas comunes en los dos arreglos, es decir, la intersección entre los dos arreglos