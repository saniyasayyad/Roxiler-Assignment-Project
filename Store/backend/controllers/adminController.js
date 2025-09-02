import pool from '../config/database.js';
import { hashPassword } from '../utils/auth.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const usersResult = await pool.query('SELECT COUNT(*) as total_users FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total_users);

    // Get total stores count
    const storesResult = await pool.query('SELECT COUNT(*) as total_stores FROM stores');
    const totalStores = parseInt(storesResult.rows[0].total_stores);

    // Get total ratings count
    const ratingsResult = await pool.query('SELECT COUNT(*) as total_ratings FROM ratings');
    const totalRatings = parseInt(ratingsResult.rows[0].total_ratings);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users with optional filtering
export const getUsers = async (req, res) => {
  try {
    const { searchTerm, filterBy, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    let query = `
      SELECT id, name, email, address, role, created_at,
             CASE 
               WHEN role = 'Store Owner' THEN (
                 SELECT COALESCE(AVG(r.rating), 0)
                 FROM stores s
                 LEFT JOIN ratings r ON s.id = r.store_id
                 WHERE s.owner_id = users.id
               )
               ELSE NULL
             END as rating
      FROM users
    `;

    const params = [];
    let paramCount = 0;

    // Add search/filter conditions
    if (searchTerm && filterBy) {
      paramCount++;
      query += ` WHERE ${filterBy} ILIKE $${paramCount}`;
      params.push(`%${searchTerm}%`);
    } else if (searchTerm) {
      paramCount++;
      query += ` WHERE (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR address ILIKE $${paramCount} OR role ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
    }

    // Add sorting
    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ' ORDER BY name ASC';
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        users: result.rows
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT id, name, email, address, role, created_at,
             CASE 
               WHEN role = 'Store Owner' THEN (
                 SELECT COALESCE(AVG(r.rating), 0)
                 FROM stores s
                 LEFT JOIN ratings r ON s.id = r.store_id
                 WHERE s.owner_id = users.id
               )
               ELSE NULL
             END as rating
      FROM users 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // Get user's ratings if they have any
    const ratingsResult = await pool.query(`
      SELECT r.id, r.rating, r.created_at, s.name as store_name
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          ratings: ratingsResult.rows
        }
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add new user
export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, address, created_at',
      [name, email, passwordHash, address, role]
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all stores with optional filtering
export const getStores = async (req, res) => {
  try {
    const { searchTerm, filterBy, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;

    const params = [];
    let paramCount = 0;

    // Add search/filter conditions
    if (searchTerm && filterBy) {
      paramCount++;
      query += ` WHERE s.${filterBy} ILIKE $${paramCount}`;
      params.push(`%${searchTerm}%`);
    } else if (searchTerm) {
      paramCount++;
      query += ` WHERE (s.name ILIKE $${paramCount} OR s.email ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`;
      params.push(`%${searchTerm}%`);
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address, s.created_at';

    // Add sorting
    const allowedSortFields = ['name', 'email', 'address', 'average_rating', 'total_ratings', 'created_at'];
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
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get store by ID
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id, s.name, s.email, s.address, s.created_at
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const store = result.rows[0];

    // Get store ratings
    const ratingsResult = await pool.query(`
      SELECT r.id, r.rating, r.created_at, u.name as user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        store: {
          ...store,
          ratings: ratingsResult.rows
        }
      }
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add new store
export const addStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    // Check if store already exists
    const existingStore = await pool.query(
      'SELECT id FROM stores WHERE email = $1',
      [email]
    );

    if (existingStore.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Store with this email already exists'
      });
    }

    // Insert new store
    const result = await pool.query(
      'INSERT INTO stores (name, email, address) VALUES ($1, $2, $3) RETURNING id, name, email, address, created_at',
      [name, email, address]
    );

    const store = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Store added successfully',
      data: {
        store
      }
    });
  } catch (error) {
    console.error('Add store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



