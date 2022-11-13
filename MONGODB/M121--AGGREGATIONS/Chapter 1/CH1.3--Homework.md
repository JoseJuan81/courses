# Solución
```js
var pipeline = [
  {
    '$match': {
      'imdb.rating': {
        '$gte': 7
      }
    }
  }, {
    '$match': {
      '$and': [
        {
          'genres': {
            '$ne': 'Crime'
          }
        }, {
          'genres': {
            '$ne': 'Horror'
          }
        }
      ]
    }
  }, {
    '$match': {
      '$or': [
        {
          'rated': {
            '$eq': 'G'
          }
        }, {
          'rated': {
            '$eq': 'PG'
          }
        }
      ]
    }
  }, {
    '$match': {
      '$and': [
        {
          'languages': {
            '$eq': 'English'
          }
        }, {
          'languages': {
            '$eq': 'Japanese'
          }
        }
      ]
    }
  }
]
```

## Solución del curso
```js
var pipeline = [
  {
    $match: {
      "imdb.rating": { $gte: 7 },
      genres: { $nin: [ "Crime", "Horror" ] } ,
      rated: { $in: ["PG", "G" ] },
      languages: { $all: [ "English", "Japanese" ] }
    }
  }
]
```