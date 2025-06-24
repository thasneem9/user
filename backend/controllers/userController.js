import pool from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const createAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '40m' });

const createRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });


export const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const exists = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (exists.rowCount) return res.status(409).json({ message: 'User already exists' });

    // const hashed = await bcrypt.hash(password, 10); 
    const r = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, password]
    );

    res.status(201).json({ message: 'User created', user_id: r.rows[0].id });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup error' });
  }
};


export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const r = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
    const user = r.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // const match = await bcrypt.compare(password, user.password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

   res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true, 
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 daysss
});

    res.json({ accessToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error' });
  }
};


export const refreshAccessToken=(req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const newAccessToken = createAccessToken(decoded.id);
    res.json({ accessToken: newAccessToken });
  });
}


export const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out' });
};


export const getMyProfile = async (req, res) => {
  const uid = req.user.id;

  try {
    const user = await pool.query(
      `SELECT id, username FROM users WHERE id = $1`,
      [uid]
    );

    if (!user.rowCount)
      return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ user: user.rows[0] });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};


export const updateMyProfile = async (req, res) => {
  const uid = req.user.id;
  const { username, password } = req.body;

  if (!username && !password)
    return res.status(400).json({ message: 'No changes provided.' });

  try {
    const fields = [];
    const values = [uid];

    if (username) {
      const existing = await pool.query(
        `SELECT id FROM users WHERE username = $1 AND id <> $2`,
        [username, uid]
      );
      if (existing.rowCount)
        return res.status(409).json({ message: 'Username already taken.' });

      fields.push(`username = $${fields.length + 2}`);
      values.push(username);
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push(`password = $${fields.length + 2}`);
      values.push(hashed);
    }

    const updated = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $1 RETURNING id, username`,
      values
    );

    res.status(200).json({ user: updated.rows[0] });

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const deleteMyAccount = async (req, res) => {
  const uid = req.user.id;

  try {
    const deleted = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [uid]
    );

    if (!deleted.rowCount)
      return res.status(404).json({ message: 'Account not found.' });

    res.status(200).json({ message: 'Your account has been deleted.' });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT id, username FROM users ORDER BY id`
    );

    res.status(200).json({ users: users.rows });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res.status(400).json({ message: "'id' is required." });

  try {
    const deleted = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [id]
    );

    if (!deleted.rowCount)
      return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ message: `User with ID ${id} deleted.` });

  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

