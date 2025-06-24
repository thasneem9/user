
import pool from '../db/db.js';

export const viewPost = async (req, res) => {
const { post_id } = req.params;
  const uid = req.user.id;

  if (!post_id) return res.status(400).json({ message: "'post_id' required." });

  try {
    const postCheck = await pool.query(
      `SELECT id, user_id FROM posts WHERE id = $1`,
      [post_id]
    );

    if (!postCheck.rowCount)
      return res.status(404).json({ message: 'Post not found.' });

    if (postCheck.rows[0].user_id !== uid)
      return res.status(403).json({ message: 'Not authorized to view this post.' });

    const fullPost = await pool.query(
      `SELECT p.id, p.title, p.content, p.user_id, u.username
       FROM posts p JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [post_id]
    );

    res.status(200).json({ post: fullPost.rows[0] });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const createPost = async (req, res) => {

  console.log('User:', req.user);

  const { title, content } = req.body;
  const uid = req.user.id;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required.' });
  try {
    const r = await pool.query(
      `INSERT INTO posts (title, content, user_id)
       VALUES ($1, $2, $3) RETURNING id, title, content, user_id`,
      [title, content, uid]
    );
    res.status(201).json({ post: r.rows[0] });
  } catch(error) {
    console.log(error)
    res.status(500).json({ message: 'Server error.' });
  }
};

export const deletePost = async (req, res) => {
  const { post_id } = req.body;
  const uid = req.user.id;

  if (!post_id) return res.status(400).json({ message: "'post_id' required." });

  try {
    const check = await pool.query(`SELECT user_id FROM posts WHERE id = $1`, [post_id]);
    if (!check.rowCount) return res.status(404).json({ message: 'Post not found.' });
    if (check.rows[0].user_id !== uid)
      return res.status(403).json({ message: 'Not authorized to delete this post.' });

    await pool.query(`DELETE FROM posts WHERE id = $1`, [post_id]);
    res.status(200).json({ message: 'Deleted.' });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};


export const updatePost = async (req, res) => {
  const { post_id, title, content } = req.body;
  const uid = req.user.id;

  if (!post_id || (!title && !content))
    return res.status(400).json({ message: 'Data missing.' });

  try {
    const check = await pool.query(`SELECT user_id FROM posts WHERE id = $1`, [post_id]);
    if (!check.rowCount) return res.status(404).json({ message: 'Post not found.' });
    if (check.rows[0].user_id !== uid)
      return res.status(403).json({ message: 'Not authorized to update this post.' });

    const fields = [];
    const values = [post_id];
    if (title) { fields.push(`title = $${fields.length + 2}`); values.push(title); }
    if (content) { fields.push(`content = $${fields.length + 2}`); values.push(content); }

    const query = `
      UPDATE posts SET ${fields.join(', ')}
      WHERE id = $1 RETURNING id, title, content, user_id
    `;
    const updated = await pool.query(query, values);

    res.status(200).json({ post: updated.rows[0] });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getMyPosts = async (req, res) => {
  const uid = req.user.id;

  try {
    const posts = await pool.query(
      `SELECT id, title, content, user_id FROM posts WHERE user_id = $1 ORDER BY id DESC`,
      [uid]
    );

    console.log("Posts found:", posts.rows); // ✅
    console.log("Request user ID:", req.user.id); // Should match user_id in posts table

    res.status(200).json({ posts: posts.rows });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await pool.query(
      `SELECT p.id, p.title, p.content, p.user_id, u.username
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.id DESC`
    );

    res.status(200).json({ posts: posts.rows });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};



