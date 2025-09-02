-- Store Rating System Schema

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

-- Function to update `updated_at`
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_stores_updated BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_ratings_updated BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- View: store ratings summary
CREATE OR REPLACE VIEW store_ratings_summary AS
SELECT 
    s.id,
    s.name,
    s.email,
    s.address,
    s.owner_id,
    COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
    COUNT(r.id) AS total_ratings,
    s.created_at,
    s.updated_at
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at;

-- Seed data

-- Admin user
INSERT INTO users (name, email, password_hash, address, role)
VALUES (
    'Admin User',
    'admin@system.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- "password"
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

