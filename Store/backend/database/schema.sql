-- Create database schema for Store Rating System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT NOT NULL CHECK (LENGTH(address) <= 400),
    role VARCHAR(20) NOT NULL CHECK (role IN ('System Administrator', 'Normal User', 'Store Owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20),
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL CHECK (LENGTH(address) <= 400),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id) -- One rating per user per store
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_stores_email ON stores(email);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for store ratings with average
CREATE OR REPLACE VIEW store_ratings_view AS
SELECT 
    s.id,
    s.name,
    s.email,
    s.address,
    s.owner_id,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as total_ratings,
    s.created_at,
    s.updated_at
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at;

-- Insert default admin user (password: Admin@123)
INSERT INTO users (name, email, password_hash, address, role) 
VALUES (
    'System Administrator Default User',
    'admin@system.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'Admin@123'
    '100 Admin Street, System City, Admin State 12345',
    'System Administrator'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data for testing
INSERT INTO users (name, email, password_hash, address, role) 
VALUES 
    ('Jane Normal User Johnson Sample User',
     'jane@email.com',
     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
     '200 User Avenue, Normal Town, User State 54321',
     'Normal User'),
    ('Premium Store Owner Sample User',
     'store@owner.com',
     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
     '400 Owner Plaza, Business District, Owner State 98765',
     'Store Owner')
ON CONFLICT (email) DO NOTHING;

-- Insert sample stores
INSERT INTO stores (name, email, address, owner_id) 
VALUES 
    ('Tech Electronics Store Sample Store',
     'tech@store.com',
     '123 Tech Street, Silicon Valley, Tech State 11111',
     (SELECT id FROM users WHERE email = 'store@owner.com')),
    ('Fashion Boutique Premium Sample Store',
     'fashion@boutique.com',
     '456 Fashion Avenue, New York, Fashion State 22222',
     NULL),
    ('Grocery Mart Superstore Sample Store',
     'grocery@mart.com',
     '789 Market Street, Downtown, Market State 33333',
     NULL)
ON CONFLICT (email) DO NOTHING;
