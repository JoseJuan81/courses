# $graphLookUp
Este `stage` es usado comunmente para consultas muy anidadas y permite obtener datos relacionados. Consultas recursivas.
Un ejemplo común es la estructura herárquica de una empresa.

```bash
$graphLookUp: {
	from: <lookup table: Colección de la cual obtener datos>,
	startWith: <expression  for value start from: inicio del proceso recursivo>,
	connectFromField: <field name to connect from>
	connectToField: <field name to connect to>
	as: <field name for results array>,
	maxDepth: <number of iterations to perform: campo opcional>,
	depthField: <field name for numbers of iterations to reach this node>,
	restrictSearchWithMatch: <match condition to apply to lookup>
}
```
## Ejemplo
```js
{ "_id": 9, "name": "Shannon", "title": "VP Education", "reports_to": 5 },
{ "_id": 1, "name": "Dev", "title": "CEO" },
{ "_id": 7, "name": "Elyse", "title": "COO", "reports_to": 2 },
{ "_id": 6, "name": "Ron", "title": "VP PM", "reports_to": 2 },
{ "_id": 4, "name": "Carlos", "title": "CRO", "reports_to": 1 },
{ "_id": 5, "name": "Andrew", "title": "VP Eng", "reports_to": 2 },
{ "_id": 3, "name": "Meagen", "title": "CMO", "reports_to": 1 },
{ "_id": 10, "name": "Dan", "title": "VP Core Engineering", "reports_to": 5 },
{ "_id": 2, "name": "Eliot", "title": "CTO",  "reports_to": 1 },
{ "_id": 11, "name": "Cailin", "title": "VP Cloud Engineering", "reports_to": 5 },
{ "_id": 8, "name": "Richard", "title": "VP PS", "reports_to": 1 }
```
### Obtener la estructura completa debajo o dependiente de Eliot el CTO
```bash
db.parent_reference.aggregate([
{ $match: { name: "Eliot" } },
{
	$graphLookUp: {
		from: 'parent_reference',
		startWith: '$_id',
		connectFromField: '_id',
		connectToField: 'reports_to',
		as: 'all_reports'
	}
}
])
```
> este query obtiene todos los datos dependientes directa e indirectamente de "Eliot"

#### Resultado
```js
{
	"_id": 2,
	"name": "Eliot",
	"title": "CTO", 
	"reports_to": 1,
	"all_reports": [
		{ "_id": 7, "name": "Elyse", "title": "COO", "reports_to": 2 },
		{ "_id": 6, "name": "Ron", "title": "VP PM", "reports_to": 2 },
		{ "_id": 9, "name": "Shannon", "title": "VP Education", "reports_to": 5 },
		{ "_id": 10, "name": "Dan", "title": "VP Core Engineering", "reports_to": 5 },
		{ "_id": 6, "name": "Ron", "title": "VP PM", "reports_to": 2 },
		{ "_id": 11, "name": "Cailin", "title": "VP Cloud Engineering", "reports_to": 5 },
		{ "_id": 5, "name": "Andrew", "title": "VP Eng", "reports_to": 2 },
	]
},
```
### Obtener la estructura completa arriba ( jefes ) de Shannon, una empresa cualquiera
```bash
db.parent_reference.aggregate([
{ $match: { name: "Shannon" } },
{
	$graphLookUp: {
		from: 'parent_reference',
		startWith: '$reports_to',
		connectFromField: '$reports_to',
		connectToField: '_id_',
		as: 'bosses'
	}
}
])
```

#### Resultado
```js
{
	"_id": 9,
	"name": "Shannon",
	"title": "VP Education", 
	"reports_to": 5,
	"bosses": [
		{ "_id": 1, "name": "Dev", "title": "CEO" },
		{ "_id": 2, "name": "Eliot", "title": "CTO", "reports_to": 1 },
		{ "_id": 5, "name": "Andrew", "title": "VP Eng", "reports_to": 2 },
	]
},
```

### Usar campos opcionales maxDepht y restrictSearchWithMatch
```bash
db.airlines.aggregate([
{ $match: { name: "TAP Portugal" } },
{
	$graphLookUp: {
		from: 'routes', // collection routes
		startWith: '$base', // campo base en collection airline
		connectFromField: 'dst_airport', // usa el valor de dst_airport para buscar otro documento con mismo valor pero en campo src_airport
		connectToField: 'src_airport',
		as: 'chain',
		maxDepth: 1, // significa que hará dos ciclos recursivos, el 0 y el 1.
		restrictSearchWithMatch: { "airline.name": "TAP Portugal" } // filtrará el resultado de la recursividad. Solo se mostrarán los documentos con airline.name = TAP Portugal
	}
}
])
```