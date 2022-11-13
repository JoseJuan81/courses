# Accumulator Expressions en $project
Existen acumuladores simples para ser usados en `$project` que nos permiten calcular múltiples cosas como por ejemplo:
- `$sum`
- `$avg`
- `$max`
- `$min`
- `$stdDevPop`
- [mas..](https://www.mongodb.com/docs/manual/reference/operator/aggregation/#group-accumulator-operators)

Es importante resaltar que estos acumuladores solo se utilizan para campos tipo `arrays`. Para hacer cálculos entre campos de varios documentos es necesario usar `$group`.

En casos en los que estos acumuladores no puedan brindarnos los cálculos deseados, es posible usar `$reduce` o `$map` para iterar sobre cada elemento, realizar cálculos y acumular resultados.
```bash
{
    $project: {
        _id: 0,
        max_high: {
            $reduce: {
                input: "$trends" <arreglo>,
                initialValue: -Infinity <valor inicial del acumulador>,
                in: {
                    $cond: [
                        { $gt: ["$$this.avg_high_tmp", "$$value"]},
                        "$$this.avg_high_tmp",
                        "$$value"
                    ]
                }
            }
        }
    }
}
```
> `$$this` hace mención a cada elemento del arreglo. `$$value` corresponde al valor del acumulador.
El código anterior se usa para determinar el valor máximo de `avg_high_tmp`, sin embargo es posible conseguirlo usando el acumulardor `$max`
```bash
{
    $project: {
        -id: 0,
        max_high: { $max: "$trends.avg_high_tmp" }
    }
}
```
