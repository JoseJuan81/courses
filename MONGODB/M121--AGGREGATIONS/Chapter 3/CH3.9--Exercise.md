# Ejercicio $lookup
Find the list of all possible distinct destinations, with at most one layover, departing from the base airports of airlines from Germany, Spain or Canada that are part of the "OneWorld" alliance. Include both the destination and which airline services that location. As a small hint, you should find 158 destinations.


```bash
db.air_alliances.aggregate([
  {
    $match: { name: "OneWorld" } // fitlra alianzas
  },
  {
    $graphLookup: {
      startWith: "$airlines", // campo de inicio en colección base
      from: "air_airlines", // colección con la que hacer coincidencias
      connectFromField: "name", // campo para coincidencias con connectToField => recursividad
      connectToField: "name", // campo para coincidencias con startWith
      as: "airlines", // nombre del campo resultado
      maxDepth: 0, // cantidad de recursividad
      restrictSearchWithMatch: { // filtro adicional para cada búsqueda
        country: { $in: ["Germany", "Spain", "Canada"] }
      }
    }
  },
  {
    $graphLookup: {
      startWith: "$airlines.base",
      from: "air_routes",
      connectFromField: "dst_airport",
      connectToField: "src_airport",
      as: "connections",
      maxDepth: 1
    }
  },
  {
    $project: {
      validAirlines: "$airlines.name",
      "connections.dst_airport": 1,
      "connections.airline.name": 1
    }
  },
  { $unwind: "$connections" },
  {
    $project: {
      isValid: {
        $in: ["$connections.airline.name", "$validAirlines"]
      },
      "connections.dst_airport": 1
    }
  },
  { $match: { isValid: true } },
  {
    $group: {
      _id: "$connections.dst_airport"
    }
  }
])
```

## Pasos
1. Los documentos fluyen a ``$graphLookUp``
2. ``$graphLookUp`` apunta a la colección indicada en el campo `from`
3. Para cada documento de entrada ( que sería de la colección base ), la búsqueda empieza con el valor del campo `startWith`
4. ``$graphLookUp`` busca documentos coincidentes en la colección `from` tomando en cuenta `startWith` (de la colección base) y `connectToField` ( de la colección `from`). Esta coincidencia sería equivalente a un `maxDepth = 0`.
5. Para cada documento coincidente de la colección `from`, ``$graphLookUp`` toma el valor del campo `connectFromField` y busca documentos coincidentes comparando con `connectToField`. A partir de este paso la búsqueda se realiza solo en la colección `from` y es donde continúa la recursividad. `maxDepth = 1` significa solouna iteración en la colección `from`.
6. Cada coincidencia encontrada es almacenada en el campo tipo arreglo definido en `as`
7. `restrictSearchWithMatch` permite filtrar los documentos que van coincidiendo para tener un resultado más preciso.
ejemplo:
```bash
restrictSearchWithMatch: {
	country: { $in: ["Germany", "Spain", "Canada"] }
}
```