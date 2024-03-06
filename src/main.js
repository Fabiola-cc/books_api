import express from 'express'
import { getAllPosts } from './db.js'

const app = express()
app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening at localhost:${port}`)
})
