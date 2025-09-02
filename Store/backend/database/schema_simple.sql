-- Store Rating System Schema - Simple Version

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('System Administrator', 'Normal User', 'Store Owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_stores_email ON stores(email);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id);

-- Seed data

-- Admin user
INSERT INTO users (name, email, password_hash, address, role)
VALUES (
    'Admin User',
    'admin@system.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '123 Admin Street, System City',
    'System Administrator'
) ON CONFLICT (email) DO NOTHING;

-- Regular users
INSERT INTO users (name, email, password_hash, address, role) VALUES
    ('Alice Johnson', 'alice@email.com',
     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
     '45 Main Road, Springfield', 'Normal User'),
    ('Bob Smith', 'bob@store.com',
     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
     '78 Market Lane, Downtown', 'Store Owner')
ON CONFLICT (email) DO NOTHING;

-- Stores
INSERT INTO stores (name, email, address, owner_id) VALUES
    ('Tech World', 'tech@store.com', '12 Tech Park, Silicon Valley',
     (SELECT id FROM users WHERE email = 'bob@store.com')),
    ('Fashion Hub', 'fashion@boutique.com', '56 Style Street, New York', NULL),
    ('Daily Mart', 'grocery@mart.com', '89 Market Street, City Center', NULL)
ON CONFLICT (email) DO NOTHING;

