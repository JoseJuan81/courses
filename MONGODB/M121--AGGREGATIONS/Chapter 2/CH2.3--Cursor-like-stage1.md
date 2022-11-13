# Cursor-like Stage

- `$sort`: { <integer> }
- `$skip`: { <integer> }
- `$limit`: { <name to count> }
- `$count`: { <field we want to count>: <integer: direction sorting> }

### $sort
Ordena los documentos.
Por defecto puede usar un máximo de 100 MB de RAM. En caso requerir más es necesario especificarlo en ls pipeline con `allowDiskUse: true`
```bash
db.solarSystem.find({}).sort().pretty()
```
Order descendente
```bash
db.solarSystem.find({}).sort({ numberOfMoons: -1 }).pretty()
```
Order ascendente
```bash
db.solarSystem.find({}).sort({ numberOfMoons: 1 }).pretty()
```
### $skip
Salta los 5 primeros documentos de la colección
```bash
db.solarSystem.find({}).skip(5).pretty()
```
### $limit
Muestra solo los 5 primeros documentos de la colección
```bash
db.solarSystem.find({}).limit(5).pretty()
```
### $count
Cuenta los documentos
```bash
db.solarSystem.find({}).count()
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