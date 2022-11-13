# $lookup
`$lookup` es una stage que se usa para relacionar 2 colecciones que se encuentren en la misma base de datos. Este stage hace coincidencia entre datos de campos de diferentes coleciones y muestra el resultado.

[mas](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/)

```bash
$lookup: {
    from: <colección a unir o con la cual relacionarse>,
    localField: <campo de colección base (a la que se le aplica el `.aggregate`)>,
    foreignField: <campo de la colección externa o la que se desea relacionar>,
    as: <nombre del campo que tendrá la información producto de la relación :: array>
}
```
> as: es el nombre del nuevo campo. Si el nombre definido ya existe en la colección entonce se sobre escribirá

> Si no hay coincidencia en la relación entonces el campo as: tendrá un arreglo vacio.

#### colección air_lines
```bash
[
    { name: "Penguin Air", country: "Antarctica" }
    { name: "Delta Air Lines", country: "United States" }
    { name: "Lufthansa", country: "Germany" }
]
```
#### colección air_alliances
```bash
[
    { name: "Star Alliance", airlines: ["Lufthansa", "Air Canada"]}
    { name: "SkyTeam", airlines: ["Delta Air Lines, Lufthansa"]}
]
```

#### Aplicar $lookup
```bash
db.air_alliance.aggregate([
    {
        $lookup: {
            from: "air_lines",
            localField: "airlines",
            foreignField: "name",
            as: "airlines"
        }
    }
])
```

#### Resultado
```bash
[
    {
        name: "Star Alliance",
        airlines: [
            {name: "Lufthansa", country: "Germany"}
        ]
    },
    {
        name: "SkyTeam",
        airlines: [
            {name: "Delta Air Lines", country: "United States"},
            {name: "Lufthansa", country: "Germany"}
        ]
    }
]
```