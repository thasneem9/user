import pool from '../db/db.js';
import redisClient from '../utils/redisClient.js';

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
      'CALL add_product_proc($1, $2, $3, $4)',
      [name, category, description, price]
    );

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilteredStores = async (req, res) => {
  
  const client = await pool.connect();
  const { minPrice, maxPrice, category } = req.query;
  const cacheKey = `filtered:${minPrice || 'any'}:${maxPrice || 'any'}:${category || 'any'}`;


  try {
   
    const cursorName = 'filtered_cursor';
        // 1. Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('⚡ Returning from Redis cache');
      return res.status(200).json(JSON.parse(cached));
    }


    await client.query('BEGIN');
    await client.query(
      'CALL get_filtered_stores_proc($1, $2, $3, $4)',
      [minPrice || null, maxPrice || null, category || null, cursorName]
    );
    const result = await client.query(`FETCH ALL FROM ${cursorName}`);
    await client.query('COMMIT');
    res.status(200).json(result.rows);

      // 3. Cache the result in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(result.rows));

  } catch (err) {

    await client.query('ROLLBACK');
    console.error('Error executing stored procedure:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });

  } finally {

    client.release();
  }
};



export { addProduct, getFilteredStores };
