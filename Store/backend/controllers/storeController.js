import pool from '../config/database.js';

// Get all stores for normal users (with user's rating if exists)
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

    // Add search/filter conditions
    if (searchTerm && filterBy) {
      paramCount++;
      query += ` WHERE s.${filterBy} ILIKE $${paramCount}`;
      params.push(`%${searchTerm}%`);
    } else if (searchTerm) {
      paramCount++;
      query += ` WHERE (s.name ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address, s.created_at, ur.rating';

    // Add sorting
    const allowedSortFields = ['name', 'address', 'average_rating', 'total_ratings', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ' ORDER BY s.name ASC';
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

    // Check if store exists
    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE id = $1',
      [storeId]
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
      [userId, storeId]
    );

    if (existingRating.rows.length > 0) {
      // Update existing rating
      await pool.query(
        'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3',
        [rating, userId, storeId]
      );

      res.json({
        success: true,
        message: 'Rating updated successfully'
      });
    } else {
      // Insert new rating
      await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
        [userId, storeId, rating]
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
