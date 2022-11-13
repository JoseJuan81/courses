# Expressions with $project
Problem:

Let's find how many movies in our movies collection are a "labor of love", where the same person appears in cast, directors, and writers

Hint: You will need to use $setIntersection operator in the aggregation pipeline to find out the result.

Note that your dataset may have duplicate entries for some films. You do not need to count the duplicate entries.
```js
db.movies.aggregate([
  // filtrar documentos cuyos campos realmente sean arreglos y NO vacios
  {
    $match: {
      cast: { $elemMatch: { $exists: true } },
      directors: { $elemMatch: { $exists: true } },
      writers: { $elemMatch: { $exists: true } }
    }
  },
  // Limpiar nombres en campo "writers" ya que algunosd tienen paréntesis
  {
    $project: {
      _id: 0,
      cast: 1,
      directors: 1,
      writers: {
        $map: {
          input: "$writers",
          as: "writer",
          in: {
            $arrayElemAt: [
              {
                $split: ["$$writer", " ("]
              },
              0
            ]
          }
        }
      }
    }
  },
  // definir arreglo "labor_of_love" con elementos únicos. Luego determinar su tamaño.
  // setIntersection: Takes two or more arrays and returns an array that contains the elements that appear in every input array.
  {
    $project: {
      labor_of_love: {
        $gt: [
          { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
          0
        ]
      }
    }
  },
  // Filtrar
  {
    $match: { labor_of_love: true }
  },
  {
    $count: "labors of love"
  }
])
```