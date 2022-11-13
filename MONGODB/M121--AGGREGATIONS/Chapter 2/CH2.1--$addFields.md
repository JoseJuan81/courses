# $addFields
Similar a `$project` pero con ciertas diferencias:
1. No elimina campos del documento tratado
2. Permite agregar nuevos campos
3. Permite modificar campos existentes
4. Conserva todos los campos del documento, mientras que con `$project` se deben especificar los campos que se quieren mostrar.

> `$addFields` realiza transformaciones sobre campos