#  Proyecto Películas API — IUDigital de Antioquia

API REST (modo Administrador) para gestionar películas y series: **Género, Director, Productora, Tipo y Media**.
Arquitectura monolítica con Frontend separado del Backend. Este repositorio contiene el **Backend + Base de datos**.

> Carpeta principal de entrega: `proyecto-peliculas-api`

---

## 1. Tecnologías

- Node.js + Express 
- MongoDB + Mongoose (para la segunda parte del tranbajo)
- express-validator (validaciones), cors, morgan, dotenv

## 2. Diseño de la base de datos

**Motor:** MongoDB (NoSQL, base `peliculasdb`).

**Colecciones ():**

| Colección | Campos |
|---|---|
| `generos` | `_id`, `nombre` (único, requerido), `estado` (Activo/Inactivo), `fechaCreacion`, `fechaActualizacion`, `descripcion` |
| `directores` | `_id`, `nombres` (requerido), `estado` (Activo/Inactivo), `fechaCreacion`, `fechaActualizacion` |
| `productoras` | `_id`, `nombre` (único, requerido), `estado` (Activo/Inactivo), `fechaCreacion`, `fechaActualizacion`, `slogan`, `descripcion` |
| `tipos` | `_id`, `nombre` (único: Película/Serie/...), `fechaCreacion`, `fechaActualizacion`, `descripcion` |
| `medias` | `_id`, `serial` (único, requerido), `titulo`, `sinopsis`, `url` (única), `imagen`, `fechaCreacion`, `fechaActualizacion`, `anioEstreno`, `genero` (ref), `director` (ref), `productora` (ref), `tipo` (ref) |

**Relaciones (referencias ObjectId + `populate`):**

```
medias.genero     ──N:1──▶ generos._id
medias.director   ──N:1──▶ directores._id
medias.productora ──N:1──▶ productoras._id
medias.tipo       ──N:1──▶ tipos._id
```

**Reglas de negocio (del caso de estudio):**
1. Una media tiene **un único** género, director, productora y tipo.
2. Al crear/editar una media, el `genero`, `director` y `productora` deben existir y estar en estado **Activo**. El `tipo` debe existir.
3. `serial` y `url` de media son **únicos**.
4. `fechaCreacion` es inmutable; `fechaActualizacion` se actualiza sola en cada `save` / `findOneAndUpdate`.
5. No hay autenticación (no requerida por ahora: solo modo Administrador sin registro).

```

## 3. Instalación y ejecución

```bash
cd proyecto-peliculas-api
npm install
cp .env.example .env
# Editar .env con tu MONGO_URI
# Local:  MONGO_URI=mongodb:
# Atlas:  MONGO_URI=mongodb+srv:

npm run dev    # desarrollo (nodemon) → http://localhost:3000
# o
npm start      # producción

# (Opcional/prueba) cargar datos iniciales: 5 géneros, 3 directores, 4 productoras, 2 tipos
npm run seed 
```

> Se necesita MongoDB corriendo localmente o una cuenta de MongoDB Atlas. (Aun no terminada)

## 4. Métodos / Endpoints (CRUD completo)

Base: `http://localhost:4000`

| Módulo | Endpoints |
|---|---|
| Géneros | `GET /api/generos` · `GET /api/generos/:id` · `POST /api/generos` · `PUT /api/generos/:id` · `DELETE /api/generos/:id` |
| Directores | `GET /api/directores` · `GET /api/directores/:id` · `POST /api/directores` · `PUT /api/directores/:id` · `DELETE /api/directores/:id` |
| Productoras | `GET /api/productoras` · `GET /api/productoras/:id` · `POST /api/productoras` · `PUT /api/productoras/:id` · `DELETE /api/productoras/:id` |
| Tipos | `GET /api/tipos` · `GET /api/tipos/:id` · `POST /api/tipos` · `PUT /api/tipos/:id` · `DELETE /api/tipos/:id` |
| Medias | `GET /api/medias` · `GET /api/medias/:id` · `POST /api/medias` · `PUT /api/medias/:id` · `DELETE /api/medias/:id` |

**Filtros:**
- `GET /api/generos?estado=Activo` (igual directores/productoras)
- `GET /api/medias?titulo=batman&genero=<id>&tipo=<id>&anioEstreno=2023`

## 5. Ejemplos de cuerpos JSON (para Postman)

**POST /api/generos**
```json
{ "nombre": "Acción", "estado": "Activo", "descripcion": "Peleas y adrenalina" }
```

**POST /api/directores**
```json
{ "nombres": "Christopher Nolan", "estado": "Activo" }
```

**POST /api/productoras**
```json
{ "nombre": "Disney", "estado": "Activo", "slogan": "Donde los sueños se hacen realidad", "descripcion": "Productora estadounidense" }
```

**POST /api/tipos**
```json
{ "nombre": "Película", "descripcion": "Producción unitaria" }
```

**POST /api/medias** (usar `_id` reales de los módulos anteriores)
```json
{
  "serial": "MOV-0001",
  "titulo": "El origen",
  "sinopsis": "Un ladrón que roba secretos de los sueños...",
  "url": "https://ejemplo.com/peliculas/el-origen",
  "imagen": "https://ejemplo.com/portadas/el-origen.jpg",
  "anioEstreno": 2010,
  "genero": "<ID_GENERO_ACTIVO>",
  "director": "<ID_DIRECTOR_ACTIVO>",
  "productora": "<ID_PRODUCTORA_ACTIVA>",
  "tipo": "<ID_TIPO>"
}
```

**PUT /api/medias/:id** (parcial permitido)
```json
{ "titulo": "El origen (remasterizada)", "anioEstreno": 2010 }
```

**Respuestas:** siempre `{ "ok": true/false, "msg": "...", "data": {...} }`. Errores de validación devuelven `400` con detalle.

## 6. Probar con Postman (o Thunder Client / Insomnia)

1. Importar la colección: `postman/Proyecto_Peliculas_API.postman_collection.json` (incluye los 5 módulos con GET/POST/PUT/DELETE y ejemplos).
2. Crear variable `baseUrl` = `http://localhost:4000`.
3. Flujo sugerido:
   1. `POST` géneros → copiar `_id`
   2. `POST` directores, productoras, tipos → copiar `_id`
   3. `POST` medias con esos IDs
   4. `GET /api/medias` (verifica `populate`: trae objetos género/director/productora/tipo)
   5. `PUT` y `DELETE` para completar el CRUD
4. Casos a evidenciar (pantallazos): crear con género Inactivo debe dar `400`; crear media con `serial` repetido debe dar `400`.

## 7. Estructura del proyecto

```
proyecto-peliculas-api/
├── package.json
├── .env.example
├── README.md
├── postman/Proyecto_Peliculas_API.postman_collection.json
└── src/
    ├── index.js            # arranque + conexión
    ├── app.js              # express + rutas
    ├── config/db.js
    ├── models/             # 5 esquemas Mongoose
    ├── controllers/        # lógica CRUD + regla de Activos
    ├── routes/             # validaciones express-validator
    ├── middlewares/validador.js
    └── seed.js             # datos iniciales
```

## 8. Criterios de entrega

- ✅ Base de datos diseñada (sección 2, aun no terminada).
- ✅ Métodos POST, GET, PUT, DELETE por cada módulo.
- ✅ Funciona y se prueba con Postman (colección incluida). `aun presenta errores`
- ✅ Carpeta principal: `proyecto-peliculas-api`.
