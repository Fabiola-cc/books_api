import express from 'express'
import cors from 'cors'
import fs from 'fs';

const app = express()
const port = 3000
// Middleware para parsear el body de las solicitudes POST
app.use(express.json())
app.use(cors())

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0', // Especifica la versión de OpenAPI
    info: {
      title: 'Nombre de tu API', // El título de tu API
      version: '1.0.0', // La versión de tu API
      description: 'Descripción de tu API', // Descripción de tu API
    },
  },
  // Paths a las carpetas donde se encuentran tus archivos de especificación de Swagger
  apis: ['./src/*.js'],
}

const specs = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// Simulación de una base de datos de libros
let posts = [
  {
    id: 1, book_title: 'Libro 1', author: 'Autor 1', genre: 'Género 1', synopsis: 'Sinopsis 1', comments: 'Comentarios 1',
  },
  {
    id: 2, book_title: 'Libro 2', author: 'Autor 2', genre: 'Género 2', synopsis: 'Sinopsis 2', comments: 'Comentarios 2',
  },
]

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retorna un listado de todos los posts.
 *     responses:
 *       200:
 *         description: Listado de todos los posts.
 */
app.get('/posts', (req, res) => {
  res.status(200).json(posts)
})

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Retorna el detalle de un post con el id postId.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id del post a buscar.
 *     responses:
 *       200:
 *         description: Detalle del post con el id especificado.
 *       404:
 *         description: Post no encontrado.
 */
app.get('/posts/:postId', (req, res) => {
  const postId = parseInt(req.params.postId.replace(/:/g, ''), 10)
  const foundPost = posts.find((post) => post.id === postId)
  if (!foundPost) {
    return res.status(404).json({ error: 'Post not found' })
  }
  return res.status(200).json(foundPost)
})

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Permite crear un nuevo post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *             example:
 *               id: 1
 *               title: Ejemplo de título
 *               body: Contenido del post
 *     responses:
 *       200:
 *         description: Post creado exitosamente.
 *       400:
 *         description: Solicitud incorrecta. El cuerpo de la solicitud no debe estar vacío.
 */
app.post('/posts', (req, res) => {
  const newPost = req.body
  if (!newPost || Object.keys(newPost).length === 0) {
    return res.status(400).json({ error: 'Bad request. Body must not be empty.' })
  }
  posts.push(newPost)
  return res.status(200).json(newPost)
})

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Permite modificar un post existente.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id del post a modificar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *             example:
 *               title: Nuevo título
 *               body: Nuevo contenido del post
 *     responses:
 *       200:
 *         description: Post modificado exitosamente.
 *       400:
 *         description: Solicitud incorrecta. El cuerpo de la solicitud no debe estar vacío.
 *       404:
 *         description: Post no encontrado.
 */
app.put('/posts/:postId', (req, res) => {
  const postId = parseInt(req.params.postId.replace(/:/g, ''), 10)
  const updatedPost = req.body
  if (!updatedPost || Object.keys(updatedPost).length === 0) {
    return res.status(400).json({ error: 'Bad request. Body must not be empty.' })
  }
  const index = posts.findIndex((post) => post.id === postId)
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' })
  }
  posts[index] = { ...posts[index], ...updatedPost }
  return res.status(200).json(posts[index])
})

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Borra un post con el id postId.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id del post a borrar.
 *     responses:
 *       204:
 *         description: Post borrado exitosamente.
 *       404:
 *         description: Post no encontrado.
 */
app.delete('/posts/:postId', (req, res) => {
  const postId = parseInt(req.params.postId.replace(/:/g, ''), 10)
  const initialLength = posts.length
  posts = posts.filter((post) => post.id !== postId)
  if (posts.length === initialLength) {
    return res.status(404).json({ error: 'Post not found' })
  }
  return res.sendStatus(204)
})

// Middleware para escribir en el archivo log.txt
app.use((req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    payload: req.body,
    response: null,
  }

  res.on('finish', () => {
    logData.response = res.statusCode
    try {
      fs.appendFileSync('log.txt', `${JSON.stringify(logData)}\n`)
    } catch (error) {
      // Manejar el error de alguna manera, como registrar o enviar una notificación
      // Por ejemplo, puedes escribir el error en otro archivo de registro
      fs.appendFileSync('error.log', `Error writing to log file: ${error}\n`)
    }
  })
  next()
})

// Manejador de errores para errores 500
app.use((err, req, res) => {
  // Registra el error en un archivo de registro
  fs.appendFileSync('error.log', `Internal server error: ${err}\n`)
  // Envía una respuesta de error al cliente
  res.status(500).json({ error: 'Internal server error' })
})

// Manejador de errores para métodos no implementados (501)
app.use((req, res) => {
  res.status(501).json({ error: 'Method not implemented' })
})

// Manejador de errores para endpoints no existentes (404) y errores de formato de body (400)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Iniciar el servidor
app.listen(port)
