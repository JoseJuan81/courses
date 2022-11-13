# $Sample
Es una utilidad que selecciona documentos aleatorios de una determinada colección de acuerdo a las siguientes consideraciones:

```bash
{ $sample: { size: <N, how many documents> } }
```
#### 1 - Cursor aleatorio selecciona documentos si:
- N <= 5% número de documentos de la colección
- Colección tiene >= 100 documentos
- $sample es el primer stage
#### 2 - Selección de documentos In-Memory si:
- Las condiciones de arriba no se cumplen