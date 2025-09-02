# Store Rating System Backend

A comprehensive backend API for a store rating system built with Express.js and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **User Management**: CRUD operations for users with different roles (Admin, Normal User, Store Owner)
- **Store Management**: Add and manage stores with ratings
- **Rating System**: Submit, update, and view store ratings
- **Dashboard Analytics**: Comprehensive statistics for different user roles
- **Search & Filtering**: Advanced search and filtering capabilities
- **Form Validation**: Comprehensive input validation
- **Security**: Rate limiting, CORS, Helmet security headers

## Tech Stack

- **Backend**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=store_rating_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb store_rating_db
   
   # Run schema
   psql -d store_rating_db -f database/schema.sql
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/password` | Update password | Yes |

### Admin Routes

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard/stats` | Get dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/users/:id` | Get user by ID | Admin |
| POST | `/api/admin/users` | Add new user | Admin |
| GET | `/api/admin/stores` | Get all stores | Admin |
| GET | `/api/admin/stores/:id` | Get store by ID | Admin |
| POST | `/api/admin/stores` | Add new store | Admin |

### Store Routes (Normal Users)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/stores` | Get stores with user ratings | Normal User/Admin |
| POST | `/api/stores/ratings` | Submit/update rating | Normal User/Admin |
| GET | `/api/stores/ratings` | Get user's ratings | Normal User/Admin |

### Store Owner Routes

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/store-owner/dashboard` | Get store owner dashboard | Store Owner |
| GET | `/api/store-owner/stores/:storeId/ratings` | Get store ratings | Store Owner |
| GET | `/api/store-owner/raters` | Get users who rated stores | Store Owner |

## Request/Response Examples

### User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe Sample User Name",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "address": "123 Main Street, City, State 12345"
}
```

### User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@system.com",
  "password": "Admin@123"
}
```

### Submit Rating
```bash
POST /api/stores/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "storeId": 1,
  "rating": 5
}
```

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(60) NOT NULL, min 20 chars)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password_hash` (VARCHAR(255) NOT NULL)
- `address` (TEXT NOT NULL, max 400 chars)
- `role` (VARCHAR(20) NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Stores Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(60) NOT NULL, min 20 chars)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `address` (TEXT NOT NULL, max 400 chars)
- `owner_id` (INTEGER REFERENCES users(id))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Ratings Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users(id))
- `store_id` (INTEGER REFERENCES stores(id))
- `rating` (INTEGER NOT NULL, 1-5)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Default Users

The system comes with pre-configured users for testing:

1. **Admin User**
   - Email: `admin@system.com`
   - Password: `Admin@123`
   - Role: System Administrator

2. **Normal User**
   - Email: `jane@email.com`
   - Password: `Admin@123`
   - Role: Normal User

3. **Store Owner**
   - Email: `store@owner.com`
   - Password: `Admin@123`
   - Role: Store Owner

## Validation Rules

### Name
- Minimum: 20 characters
- Maximum: 60 characters

### Email
- Must be valid email format
- Must be unique

### Password
- Length: 8-16 characters
- Must contain at least one uppercase letter
- Must contain at least one special character

### Address
- Maximum: 400 characters
- Required field

### Rating
- Must be between 1 and 5
- Integer values only

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Various HTTP headers for security
- **Input Validation**: Comprehensive validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
# Run schema
psql -d store_rating_db -f database/schema.sql
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use a process manager like PM2
6. Set up proper database backups

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.



