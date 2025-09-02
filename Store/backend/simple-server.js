import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Saniya_postgres",
  database: process.env.DB_NAME || "store_rating_db",
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      error: err.message 
    });
  }
});

// Get all stores
app.get("/api/stores", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        s.owner_id,
        s.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stores:', err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add a new store
app.post("/api/stores", async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    
    // Validate required fields
    if (!name || !email || !address) {
      return res.status(400).json({ 
        error: "Name, email, and address are required" 
      });
    }

    const result = await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, owner_id || null]
    );
    
    console.log('✅ New store added:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding store:', err.message);
    if (err.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: "Store with this email already exists" });
    } else {
      res.status(500).json({ error: "Server Error" });
    }
  }
});

// Add a rating for a store
app.post("/api/stores/:storeId/ratings", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { user_id, rating } = req.body;
    
    if (!user_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: "Valid user_id and rating (1-5) are required" 
      });
    }

    const result = await pool.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *",
      [user_id, storeId, rating]
    );
    
    console.log('✅ New rating added:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding rating:', err.message);
    if (err.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: "You have already rated this store" });
    } else if (err.code === '23503') { // Foreign key violation
      res.status(400).json({ error: "Invalid user or store ID" });
    } else {
      res.status(500).json({ error: "Server Error" });
    }
  }
});

// Get users (for testing)
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/stores - Get all stores`);
  console.log(`   POST /api/stores - Add new store`);
  console.log(`   POST /api/stores/:id/ratings - Add rating`);
  console.log(`   GET  /api/users - Get all users`);
});

