# $Sample
Es una utilidad que selecciona documentos aleatorios de una determinada colección de acuerdo a las siguientes consideraciones:

```bash
{ $sample: { size: <N, how many documents> } }
```
#### 1 - Cursor aleatorio selecciona los documentos si:
- N <= 5% número de documentos de la colección
- Colección tiene >= 100 documentos
- $sample es el primer stage
#### 2 - Selección de documentos In-Memory de forma aleatoria si:
- Las condiciones de arriba no se cumplen
NOTA: este tipo de selección usa el método $sort implicitamente y por tal motivo está limitado a 100MB, es decir, ordena y seleccionar de forma aleatoria la cantidad de documentos definida.