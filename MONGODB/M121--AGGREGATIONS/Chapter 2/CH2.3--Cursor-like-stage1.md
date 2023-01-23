# Cursor-like Stage
Los siguientes operadores forman parte del Cursor-like propuestos por MongoDB:
- `$sort`: { <integer> }
- `$skip`: { <integer> }
- `$limit`: { <name to count> }
- `$count`: { <field we want to count>: <integer: direction sorting> }

### $sort
Ordena los documentos de acuerdo al campo especificado aunque pueden definirse varios campos de ordenamiento.
| Orden | Valor | Descripción |
|:----- |:-----:|:-----------:|
| Des   | -1    | Descendente |
| Asc   | 1     | Ascendente  |

Por defecto puede usar un máximo de 100 MB de RAM. En caso requerir más es necesario especificarlo en ls pipeline con `allowDiskUse: true` pero si $sort está en los primeros stages de la pipeline puede hacer uso de los `indexes`.

```bash
db.solarSystem.find({}).sort().pretty()
```
Order descendente
```bash
db.solarSystem.find({}).sort({ numberOfMoons: -1 }).pretty()
db.solarSystem.aggregate([
    { $sort: { numberOfMoons: -1 } }
])
```
Order ascendente
```bash
db.solarSystem.find({}).sort({ numberOfMoons: 1 }).pretty()
db.solarSystem.aggregate([
    { $sort: { numberOfMoons: 1 } }
])
```
### $skip
Salta los 5 primeros documentos de la colección ( según fueron guardados )
```bash
db.solarSystem.find({}).skip(5).pretty()
db.solarSystem.aggregate([
    { $skip: 5 }
])
```
### $limit
Muestra solo los 5 primeros documentos de la colección
```bash
db.solarSystem.find({}).limit(5).pretty()
db.solarSystem.aggregate([
    { $limit: 5 }
])
```
### $count
Cuenta los documentos
```bash
db.solarSystem.find({}).count()
db.solarSystem.aggregate([
    { $count: 'nombre del campo' }
])
```
Resultado
```bash
result: [
    {
        'nombre del campo': 18
    }
], ok: 1
```

## En Pipeline
```bash
db.solarSystem.aggregate([
    {$project: {
        _id:0,
        name: 1,
        numberOfMoons: 1
    }},
    {$limit: 5}
])
```

```bash
db.solarSystem.aggregate([
    {$project: {
        _id:0,
        name: 1,
        numberOfMoons: 1
    }},
    {$skip: 1}
])
```
```bash
db.solarSystem.aggregate([
    {$project: {
        _id:0,
        name: 1,
        numberOfMoons: 1
    }},
    {$sort: { numberOfMoons: -1 }},
    { allowDiskUse: true }
])
```