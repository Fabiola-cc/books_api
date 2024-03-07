import conn from './conn'

export default async function getAllPosts() {
  const [rows] = await conn.query('SELECT * FROM blog_posts')
  return rows
}
