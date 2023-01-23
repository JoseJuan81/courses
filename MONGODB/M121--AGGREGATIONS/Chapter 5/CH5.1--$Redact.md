# $Redact
Permite proteger información de accesos no autorizados. Particularmente, $redact permite ir evaluando de forma decendente el acceso a la información, lo que quiere decir que la información debe estar anidada en varios niveles.
Este stage requiere la utilización de 3 variables instructivas:
- $$DESCEND: Significa que conserva la información ( sin mostrar subdocumentos o arreglos de subdocumentos ) del nivel autorizado y avanzará un nivel más para inspeccionar condiciones de autorización
- $$PRUNE: Significa que removerá el nivel de información a la que no se tiene autorización
- $$KEEP: Significa que mantendrá el nivel de información a la que se tiene acceso pero no se seguirá haciendo verificación de acceso.

NOTA: El campo que se usa para comparar la autorización debe estar en todos los niveles del la colección o de lo contrario arrojará error.

[mas](https://www.mongodb.com/docs/manual/reference/operator/aggregation/redact)

```bash
{
  $redact: {
    $cond: [
      { $in: ["Management", "$acl"] }, "$$DESCEND", "$$PRUNE"]
    ]
  }
}
```
El comando anterior permite inspeccionar la información mediante el siguiente esquema:
- En nivel 0 se verifica que la variable "acl" tenga el valor "Management". Si es así, entonces $$DESCEN permite que se avance al próximo nivel ( documento anidado ) y sea inspeccionado, de lo contrario $$PRUNE solo retorna la información de este nivel sin las variables relacionadas con la autorización negada.

### Ejemplo
Documento ejemplo
```javascript
{
  acl: ["HR", "Management", "Finance", "Executive"],
  empmloyee_compensation: {
    acl: ["Management", "Finance", "Executive"],
    salary: 154776,
    stock_award: 3122,
    programs:{
      acl: ["Finance", "Executive"],
      contrib_401K: 0.03,
      health_plan: true
    }
  }
}
```
De acuerdo al query la información retornada sería
```bash
{
  acl: ["HR", "Management", "Finance", "Executive"],
  empmloyee_compensation: {
    acl: ["Management", "Finance", "Executive"],
    salary: 154776,
    stock_award: 3122,
  }
}
```
Notar que la variable `programs` no se muestra debido a que el usuario no está autorizado a este nivel de información.