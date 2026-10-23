# API de gestión de notas

API REST con Express 5 y MySQL. La tabla `notas` se define en [schema.sql](./schema.sql).

## Requisitos y configuración

- Node.js 18 o posterior.
- MySQL 8 o compatible.

1. Crea la base de datos y la tabla ejecutando `schema.sql` en MySQL Workbench o con el cliente de MySQL:

   ```powershell
   Get-Content .\schema.sql | mysql -u root -p
   ```

2. Copia `.env_example` como `.env` y configura los valores de tu entorno:

   ```powershell
   Copy-Item .env_example .env
   ```

   `DB_USER` y `DB_NAME` son obligatorios; `DB_HOST`, `DB_PORT` y `SERVER_PORT` tienen valores predeterminados.

3. Instala dependencias y ejecuta la API:

   ```powershell
   npm install
   npm run dev
   ```

   La aplicación comprueba la conexión a MySQL antes de empezar a escuchar. La dirección predeterminada es `http://localhost:3000`.

## Rutas para probar en Postman

Configura `http://localhost:3000` como URL base. Para las solicitudes con cuerpo, selecciona **Body → raw → JSON** y usa el encabezado `Content-Type: application/json`.

| Método | Ruta | Descripción | Respuesta correcta |
| --- | --- | --- | --- |
| GET | `/health` | Comprueba que la API está activa. | `200 OK` |
| GET | `/api/v1/preferencia` | Devuelve la última categoría guardada en la cookie. | `200 OK` |
| POST | `/api/v1/notas` | Crea una nota. | `201 Created` |
| GET | `/api/v1/notas` | Lista todas las notas. | `200 OK` |
| GET | `/api/v1/notas/:id` | Busca una nota por ID. | `200 OK` |
| PATCH | `/api/v1/notas/:id` | Actualiza uno o más campos de una nota. | `200 OK` |
| DELETE | `/api/v1/notas/:id` | Elimina una nota. | `204 No Content` |

### Crear nota

`POST http://localhost:3000/api/v1/notas`

```json
{
  "titulo": "Repasar álgebra",
  "contenido": "Resolver los ejercicios de la unidad 2",
  "categoria": "clase"
}
```

Las categorías permitidas son `clase`, `tarea` e `idea`. La respuesta incluye la nota guardada por MySQL, su ID y sus marcas de tiempo:

```json
{
  "data": {
    "id": 1,
    "titulo": "Repasar álgebra",
    "contenido": "Resolver los ejercicios de la unidad 2",
    "categoria": "clase",
    "created_at": "2026-10-23T14:00:00.000Z",
    "updated_at": "2026-10-23T14:00:00.000Z"
  }
}
```

El servidor también establece la cookie `ultimaCategoria`.

### Listar y buscar notas

- `GET http://localhost:3000/api/v1/notas`
- `GET http://localhost:3000/api/v1/notas/1`

La respuesta es un objeto con la propiedad `data`; para la lista, `data` es un arreglo.

### Actualizar nota

`PATCH http://localhost:3000/api/v1/notas/1`

Envía solo los campos que quieras cambiar:

```json
{
  "categoria": "tarea"
}
```

Un PATCH vacío o con los mismos valores conserva y devuelve la nota existente.

### Eliminar nota

`DELETE http://localhost:3000/api/v1/notas/1`

Una eliminación correcta devuelve `204 No Content` y no tiene cuerpo.

### Respuestas de error

- `400 Bad Request`: cuerpo inválido, categoría no permitida o ID que no sea un entero positivo válido para MySQL.
- `404 Not Found`: ruta o nota inexistente.
- `500 Internal Server Error`: error inesperado del servidor o de la base de datos.

## Pruebas

Ejecuta las pruebas automatizadas con:

```powershell
npm test
```

Las pruebas automatizadas no requieren una conexión activa a MySQL.
