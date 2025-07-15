import pool from '../db/db.js';


const addProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price must be defined' });
    }

    if (isNaN(price)) {
      return res.status(400).json({ error: 'price must be a number' });
    }

    await pool.query(
      'INSERT INTO store (name, category, description, price) VALUES ($1, $2, $3, $4)',
      [name, category, description, price]
    );

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilteredStores = async (req, res) => {
  try {
    const { minPrice, maxPrice, category } = req.query;

    const values = [
      minPrice || null,
      maxPrice || null,
      category || null,
    ];
    //like values = [100, null, 'Laptop']

    const query = 'SELECT * FROM get_filtered_stores($1, $2, $3)';
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching filtered stores:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export { addProduct, getFilteredStores };
