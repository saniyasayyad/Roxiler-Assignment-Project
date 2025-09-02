import pool from '../config/database.js';

// Allowed fields to guard dynamic SQL (prevents SQL injection on column names)
const ALLOWED_FILTER_FIELDS = new Set(['name', 'address', 'email']);
const ALLOWED_SORT_FIELDS = new Set(['name', 'address', 'average_rating', 'total_ratings', 'created_at']);
const ALLOWED_SORT_ORDERS = new Set(['ASC', 'DESC']);

// Get all stores for normal users (includes user's own rating if present)
export const getStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchTerm, filterBy, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings,
             ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    // Add search/filter conditions (validate column names)
    if (searchTerm && filterBy && ALLOWED_FILTER_FIELDS.has(filterBy)) {
      paramCount++;
      query += ` WHERE s.${filterBy} ILIKE $${paramCount}`;
      params.push(`%${searchTerm}%`);
    } else if (searchTerm) {
      paramCount++;
      query += ` WHERE (s.name ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address, s.created_at, ur.rating';

    // Add sorting (validate sort field and order)
    const normalizedOrder = String(sortOrder).toUpperCase();
    if (ALLOWED_SORT_FIELDS.has(sortBy) && ALLOWED_SORT_ORDERS.has(normalizedOrder)) {
      query += ` ORDER BY ${sortBy} ${normalizedOrder}`;
    } else {
      query += ' ORDER BY name ASC';
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        stores: result.rows
      }
    });
  } catch (error) {
    console.error('Get stores for user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Submit or update rating for a store
export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Basic input validation
    const numericStoreId = Number(storeId);
    const numericRating = Number(rating);
    if (!Number.isInteger(numericStoreId) || numericStoreId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid storeId must be provided'
      });
    }
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    // Check if store exists
    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE id = $1',
      [numericStoreId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user already rated this store
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, numericStoreId]
    );

    if (existingRating.rows.length > 0) {
      // Update existing rating
      await pool.query(
        'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3',
        [numericRating, userId, numericStoreId]
      );

      res.json({
        success: true,
        message: 'Rating updated successfully'
      });
    } else {
      // Insert new rating
      await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
        [userId, numericStoreId, numericRating]
      );

      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully'
      });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new store (for Store Owner or Admin)
export const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and address are required'
      });
    }

    const insertResult = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, address, owner_id, created_at',
      [name, email, address, owner_id ?? null]
    );

    return res.status(201).json({
      success: true,
      data: insertResult.rows[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'A store with this email already exists'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's ratings
export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT r.id, r.rating, r.created_at, r.updated_at,
             s.id as store_id, s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: {
        ratings: result.rows
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


