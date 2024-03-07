import express from 'express'
import fs from 'fs';

const app = express()
const port = 3000

// Middleware para parsear el body de las solicitudes POST
app.use(express.json())

// Simulación de una base de datos de libros
let posts = [
  {
    id: 1, book_title: 'Libro 1', author: 'Autor 1', genre: 'Género 1', synopsis: 'Sinopsis 1', comments: 'Comentarios 1',
  },
  {
    id: 2, book_title: 'Libro 2', author: 'Autor 2', genre: 'Género 2', synopsis: 'Sinopsis 2', comments: 'Comentarios 2',
  },
]

// GET /posts que retorna un listado de todos los posts
app.get('/posts', (req, res) => {
  res.status(200).json(posts)
})

// GET /posts/:postId que retorna el detalle de un post con el id postId
app.get('/posts/:postId', (req, res) => {
  const postId = parseInt(req.params.postId, 10)
  const foundPost = posts.find((post) => post.id === postId)
  if (!foundPost) {
    return res.status(404).json({ error: 'Post not found' })
  }
  return res.status(200).json(foundPost)
})

// POST /posts que permite crear un nuevo post
app.post('/posts', (req, res) => {
  const newPost = req.body
  if (!newPost || Object.keys(newPost).length === 0) {
    return res.status(400).json({ error: 'Bad request. Body must not be empty.' })
  }
  posts.push(newPost)
  return res.status(200).json(newPost)
})

// PUT /posts/:postId que permite modificar un post
app.put('/posts/:postId', (req, res) => {
  const postId = parseInt(req.params.postId, 10)
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

// DELETE /posts/:postId que borra un post
app.delete('/posts/:postId', (req, res) => {
  const postId = parseInt(req.params.postId, 10)
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
    fs.appendFile('log.txt', `${JSON.stringify(logData)}\n`, (err) => {
      if (err) {
        console.error('Error writing to log file:', err)
      }
    })
  })

  next()
})

// Manejador de errores para errores 500
app.use((err, req, res) => {
  console.error('Internal server error:', err)
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
