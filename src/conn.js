import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'fabi-cc',
  database: 'blog_fabiola',
  password: 'fabiola',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
