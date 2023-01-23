# $out
Este stage debe ser el último en el pipeline del aggregate.
No puedes ser usado dentro de un `$facet`.
Tiene la siguiente forma:
```bash
{
    $out: "Nombre de la colección nueva o existente"
}
```
Si la colección indicada es nueva entonces MongoDB creará una nueva colección de lo contrario sobrescribirá la colección indicada.
- En caso de sobrescribir una colección: Mantendrá los índices creados previamente
> En caso de que ocurra un error en la pipeline no se creará la colección.
