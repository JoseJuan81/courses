# $geoNear
Permite realizar geo - consultas dentro de `aggregations`.
Geo - consultas está relacionado a localización
### Consideraciones
1. Debe ser el primer `stage`
2. No se puede usar con `$near`
3. Solo es posible usarlo si existe uno y solo un `geoindex` o tambien llamado `2dsphere`
4. Si se usa `2dsphere` el resultado retornado está en metros, sino será en radianes

### Argumentos de $geoNear
1. `near`: <requerido, the location to search near> {type: "Point"}
2. `distanceField`: <requerido, field to insert in returned documents> { type: String }
3. ``spherical``: <requerido, required to signal whether using 2dsphere index> { type: Boolean }
4. `minDistance`: <in meters>
5. `maxDistance`: <in meters>
6. `query`: <allows quering source documents>
7. ``includeLocs``: <used to identify which location was used>
8. `limit`: <max number of documents to return>
9. `num`: <same as `limit`>
10. `distanceMultiplier`: <the factor to multiply all distance>
