# Aggregations Pipelines
Análogamente, es como una línea de producción en la que se encuentran estaciones de transformación o modificación de los documentos. A cada estación se le denomina `stage`.

```bash
db.collection.aggregate(
    [
        { stage1 },
        { stage2 },
        { stage3 },
        { stageN }
    ],
    { options }
)
```
Cada `stage` tiene `operators` o `expressions`

### Aggregation Operator
son aquellos que definen el `stage` y comienzan con el símbolo `$`, Por ejemplo: `$match`, `$project` y `$group`.
Dentro de cada `stage` con su respecetivo `aggregation operator` se utilizan `query operators` que tambien empiezan con el mismo símbolo pero como su nombre lo indica, se usan para hacer las consultar, Por ejemplo: `$in`, `$gte`, `$lte`, etc.
> Aggregation Operators se usan para transformar o agrupar o filtrar documentos mientras que los query operator se usan para las consultas propiamente dichas, es decir, seleccionar los documentos que cumplen con la consulta o el criterio de búsqueda establecido.

### Expressions
Son como funciones ya que se les provee argumentos y nos retorna el resultado.
Las expresiones siempre aparecen o se ubican en la posición de `value`. Tener en cuenta que en `MongoDB` trabaja bajo el esquema de objeto, es decir, `key: value`. Entonces, una `èxpression` es un `value` para una determinada `key`.

```bash
db.solarSystem.aggregate([
    {
        $match: {
            atmosphericComposition: { $in: [/02/] },
            meanTemperature: { $gte: -40, $lte: 40 }
        },
        $project: {
            _id: 0,
            name: 1,
            hasMoons: { $gt: ["$numberOfMoons", 0] }
        }
    }
])
```
- ``$match y $project`` son los `aggregation operators`
- `atmosphericComposition` es una variable de los documentos de la colección
- `$in` es un `query operator`
- `$gt: ["$numberOfMoons", 0]` es una `expression`
- `$numberOfMoons` es una variable del documento. Se utiliza el símbolo debido a que aparece en el lado de `value` (esquema `key:value`).
**Resultado**
```bash
{ name: "Earth", hasMoons: true }
```
- Field path => `$numberOfMoons`. Se utiliza para acceder al valor asociado a esta `key`
- System variable => `$$UPPERCASE`, `$$CURRENT`. Estas variables siempre son en mayúsculas.
> $$CURRENT hasce referencia al documento actual
- User variable => ``$$foo``. Se trata de variables creadas por el usuario deben ser en minúscula.
