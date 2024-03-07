# Books_api

En este repositorio puedes encontrar una pequeña API pensada para usarse en un blog de lectura, para guardar posts acerca de diversos libros.

## Tabla de Contenidos
- [Endpoints](#endpoints)
- [Instalación](#instalación)
- [Uso](#uso)

## Endpoints
### GET /posts
Retorna un listado de todos los posts.

### GET /posts/:postId
Retorna el detalle de un post con el id postId.

### POST /posts
Permite crear un nuevo post.

### PUT /posts/:postId
Permite modificar un post existente.

### DELETE /posts/:postId
Borra un post con el id postId.

## Instalación

Para hacer uso del API, asegurate de tener node y npm. 
A causa de las dependencias necesitas instalar (npm install ...)
- express
- cors
- lint & eslint
- mysql2
- swagger-jsdoc, swagger-ui-express

## Uso

Al tener estos instrumentos, implementa npm start para hacer uso del API y los endpoints.
