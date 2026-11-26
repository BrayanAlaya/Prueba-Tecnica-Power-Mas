# Sistema de Gestión de Beneficiarios

Aplicación para registrar, consultar, editar y eliminar beneficiarios de un programa social multi-país.

- **Frontend:** React + TypeScript + Vite + Tailwind CSS (`prueba-tecnica-front`)
- **Backend:** .NET 8 Web API + Dapper (`PruebaTecnica/WebApplication1`)
- **Base de datos:** SQL Server, acceso mediante stored procedures (`database`)

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) 20 o superior y [pnpm](https://pnpm.io/installation)
- SQL Server en `localhost` con autenticación de Windows
- `sqlcmd` (incluido con SQL Server o las [Command Line Tools](https://learn.microsoft.com/sql/tools/sqlcmd/sqlcmd-utility))

## Instalación

1. Clonar el repositorio y entrar a la carpeta del proyecto.
2. Crear la base de datos (ver la sección siguiente).
3. Restaurar el backend:

```bash
dotnet restore PruebaTecnica/PruebaTecnica.slnx
```

4. Instalar las dependencias del frontend:

```bash
cd prueba-tecnica-front
pnpm install
```

La cadena de conexión está en `PruebaTecnica/WebApplication1/appsettings.json`:

```
Server=localhost;Database=PowerMasBeneficiarios;Trusted_Connection=True;TrustServerCertificate=True;
```

Si SQL Server no está en la instancia por defecto, cambia `Server=localhost` por el nombre de tu instancia.

## Base de datos

Los scripts están en `database/` y se ejecutan en este orden, desde la raíz del proyecto:

```bash
sqlcmd -S localhost -E -C -f 65001 -i database/01_schema.sql
sqlcmd -S localhost -E -C -f 65001 -i database/02_seed.sql
sqlcmd -S localhost -E -C -f 65001 -i database/03_stored_procedures.sql
```

`-f 65001` guarda el script en UTF-8 para que los acentos (Perú, María, etc.) se inserten bien.

| Script | Qué hace |
| --- | --- |
| `01_schema.sql` | Crea la base `PowerMasBeneficiarios` y las tablas `DocumentoIdentidad` y `Beneficiario` |
| `02_seed.sql` | Inserta tipos de documento de varios países y cinco beneficiarios de ejemplo |
| `03_stored_procedures.sql` | Crea los procedimientos de listado, alta, edición y baja |

`01_schema.sql` elimina y vuelve a crear la base de datos. Úsalo solo en un entorno de desarrollo.

El DNI de España queda inactivo a propósito: el listado del formulario solo muestra documentos con `Activo = 1`.

Procedimientos:

- `sp_DocumentoIdentidad_ListarActivos`
- `sp_DocumentoIdentidad_ObtenerPorId`
- `sp_Beneficiario_Listar`
- `sp_Beneficiario_ObtenerPorId`
- `sp_Beneficiario_Insertar`
- `sp_Beneficiario_Actualizar`
- `sp_Beneficiario_Eliminar`

## Ejecución

En una terminal, levanta la API:

```bash
dotnet run --project PruebaTecnica/WebApplication1/WebApplication1.csproj --launch-profile http
```

- API: http://localhost:5271
- Swagger: http://localhost:5271/swagger

En otra terminal, levanta el frontend:

```bash
cd prueba-tecnica-front
pnpm dev
```

La interfaz queda en http://localhost:5173. Vite reenvía `/api` a `http://localhost:5271`, así que no hace falta configurar variables de entorno. Si quieres apuntar a otra URL, copia `.env.example` a `.env` y ajusta `VITE_API_URL`.

### Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/api/documentos-identidad` | Documentos activos para el formulario |
| `GET` | `/api/beneficiarios` | Listado |
| `GET` | `/api/beneficiarios/{id}` | Detalle |
| `POST` | `/api/beneficiarios` | Alta |
| `PUT` | `/api/beneficiarios/{id}` | Edición |
| `DELETE` | `/api/beneficiarios/{id}` | Baja |

Al elegir un tipo de documento, el número se valida por la longitud y por `SoloNumeros` de ese tipo, tanto en el formulario como en la API.

## Demostración

Video del sistema en funcionamiento: [pruebaTecnicaPowerMas.mp4](pruebaTecnicaPowerMas.mp4).

## Estructura

```
database/                  Scripts SQL
PruebaTecnica/             Solución .NET (Web API)
prueba-tecnica-front/      Aplicación React
```
