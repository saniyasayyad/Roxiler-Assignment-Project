import pool from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0].now);
    
    // Read and execute schema
    console.log('📋 Setting up database schema...');
    const schemaPath = path.join(__dirname, 'database', 'schema_simple.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignore errors for statements that might already exist
          if (!error.message.includes('already exists') && !error.message.includes('duplicate key')) {
            console.warn('⚠️  Warning:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Database schema setup completed');
    
    // Test some basic queries
    console.log('🧪 Testing basic queries...');
    
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('👥 Total users:', usersResult.rows[0].count);
    
    const storesResult = await pool.query('SELECT COUNT(*) as count FROM stores');
    console.log('🏪 Total stores:', storesResult.rows[0].count);
    
    const ratingsResult = await pool.query('SELECT COUNT(*) as count FROM ratings');
    console.log('⭐ Total ratings:', ratingsResult.rows[0].count);
    
    // Show sample data
    console.log('\n📊 Sample data:');
    const sampleStores = await pool.query('SELECT id, name, email FROM stores LIMIT 3');
    console.log('Sample stores:', sampleStores.rows);
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('🚀 You can now start the server with: npm run dev');
    console.log('🔍 Health check will be available at: http://localhost:5000/health');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('1. PostgreSQL is running');
    console.log('2. Database "store_rating_db" exists');
    console.log('3. Environment variables are set correctly');
    console.log('4. You have proper permissions');
  } finally {
    await pool.end();
  }
}

setupDatabase();