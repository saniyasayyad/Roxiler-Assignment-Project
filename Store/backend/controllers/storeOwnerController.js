import pool from '../config/database.js';

// Get store owner's dashboard data
export const getStoreOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get stores owned by this user
    const storesResult = await pool.query(`
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id, s.name, s.email, s.address, s.created_at
    `, [userId]);

    const stores = storesResult.rows;

    // Get all ratings for stores owned by this user
    const ratingsResult = await pool.query(`
      SELECT r.id, r.rating, r.created_at, r.updated_at,
             s.id as store_id, s.name as store_name,
             u.id as user_id, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      JOIN users u ON r.user_id = u.id
      WHERE s.owner_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    const ratings = ratingsResult.rows;

    // Calculate overall statistics
    const totalStores = stores.length;
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    res.json({
      success: true,
      data: {
        stores,
        ratings,
        statistics: {
          totalStores,
          totalRatings,
          averageRating: Math.round(averageRating * 10) / 10
        }
      }
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get detailed ratings for a specific store owned by the user
export const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;
    const numericStoreId = Number(storeId);
    if (!Number.isInteger(numericStoreId) || numericStoreId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid storeId must be provided'
      });
    }

    // Verify the store belongs to this user
    const storeResult = await pool.query(`
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1 AND s.owner_id = $2
      GROUP BY s.id, s.name, s.email, s.address, s.created_at
    `, [numericStoreId, userId]);

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found or access denied'
      });
    }

    const store = storeResult.rows[0];

    // Get all ratings for this store
    const ratingsResult = await pool.query(`
      SELECT r.id, r.rating, r.created_at, r.updated_at,
             u.id as user_id, u.name as user_name, u.email as user_email, u.address as user_address
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `, [numericStoreId]);

    const ratings = ratingsResult.rows;

    // Calculate rating distribution
    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    ratings.forEach(rating => {
      ratingDistribution[rating.rating]++;
    });

    res.json({
      success: true,
      data: {
        store,
        ratings,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get users who rated stores owned by this user
export const getStoreRaters = async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchTerm, filterBy, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

    let query = `
      SELECT DISTINCT u.id, u.name, u.email, u.address, u.role,
             COUNT(r.id) as total_ratings_given,
             AVG(r.rating) as average_rating_given,
             MAX(r.created_at) as last_rating_date
      FROM users u
      JOIN ratings r ON u.id = r.user_id
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    // Add search/filter conditions
    if (searchTerm && filterBy) {
      paramCount++;
      query += ` AND u.${filterBy} ILIKE $${paramCount}`;
      params.push(`%${searchTerm}%`);
    } else if (searchTerm) {
      paramCount++;
      query += ` AND (u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount} OR u.address ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
    }

    query += ' GROUP BY u.id, u.name, u.email, u.address, u.role';

    // Add sorting
    const allowedSortFields = ['name', 'email', 'address', 'total_ratings_given', 'average_rating_given', 'last_rating_date'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ' ORDER BY last_rating_date DESC';
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        users: result.rows
      }
    });
  } catch (error) {
    console.error('Get store raters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


