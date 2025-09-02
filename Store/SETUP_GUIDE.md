# Store Rating System - Complete Setup Guide

This guide will help you set up both the frontend and backend for the Store Rating System.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Database Setup

First, set up your PostgreSQL database:

```bash
# Create the database
createdb store_rating_db

# Or using psql
psql -U postgres
CREATE DATABASE store_rating_db;
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
# Update the following values:
# - DB_PASSWORD=your_postgres_password
# - JWT_SECRET=your_secure_jwt_secret
# - CORS_ORIGIN=http://localhost:5173

# Set up database schema
npm run setup

# Start the backend server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ..

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 🔧 Detailed Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Schema

The database schema is automatically created when you run `npm run setup`. It includes:

- **Users table**: Stores user information with roles
- **Stores table**: Stores store information
- **Ratings table**: Stores user ratings for stores
- **Indexes**: For better query performance
- **Triggers**: For automatic timestamp updates
- **Views**: For aggregated data

### Default Users

The system comes with pre-configured users for testing:

| Email | Password | Role |
|-------|----------|------|
| `admin@system.com` | `Admin@123` | System Administrator |
| `jane@email.com` | `Admin@123` | Normal User |
| `store@owner.com` | `Admin@123` | Store Owner |

## 🧪 Testing

### Backend API Testing

```bash
# Navigate to backend directory
cd backend

# Run API tests
npm test
```

This will test:
- Health check endpoint
- User authentication
- Admin endpoints
- Store endpoints
- Store owner endpoints
- Input validation

### Manual Testing

You can also test the API manually using tools like Postman or curl:

```bash
# Test health check
curl http://localhost:5000/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@system.com", "password": "Admin@123"}'

# Get dashboard stats (use token from login response)
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
Store/
├── backend/                 # Backend API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── database/           # Database schema
│   ├── middleware/         # Authentication & validation
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   ├── setup.js            # Database setup script
│   └── test-api.js         # API test script
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── context/            # React context
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── utils/              # Utility functions
├── package.json            # Frontend dependencies
└── README.md               # Project documentation
```

## 🔐 Security Features

The backend includes several security measures:

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Various HTTP security headers
- **Input Validation**: Comprehensive validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## 🎯 Features Implemented

### System Administrator
- ✅ Dashboard with statistics
- ✅ Add new users and stores
- ✅ View all users and stores
- ✅ Search and filter functionality
- ✅ User and store details

### Normal User
- ✅ User registration and login
- ✅ View all stores
- ✅ Search stores by name and address
- ✅ Submit and modify ratings
- ✅ Password update

### Store Owner
- ✅ Dashboard with store analytics
- ✅ View store ratings and user feedback
- ✅ Average rating calculations
- ✅ User rating history

### General Features
- ✅ Role-based access control
- ✅ Form validation
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Real-time data updates

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:5432
   ```
   **Solution**: Make sure PostgreSQL is running and the database exists.

2. **Port Already in Use**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   **Solution**: Change the PORT in .env file or kill the process using the port.

3. **CORS Error**
   ```
   Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
   ```
   **Solution**: Check that CORS_ORIGIN in .env matches your frontend URL.

4. **JWT Token Error**
   ```
   Error: jwt malformed
   ```
   **Solution**: Make sure you're including the token correctly in the Authorization header.

### Getting Help

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check that all dependencies are installed
5. Verify the database schema is created properly

## 📚 API Documentation

For detailed API documentation, see:
- `backend/API_DOCUMENTATION.md` - Complete API reference
- `backend/README.md` - Backend-specific documentation

## 🎉 Success!

Once everything is set up, you should be able to:

1. Access the frontend at `http://localhost:5173`
2. Login with any of the default users
3. Test all functionality based on user roles
4. Use the API endpoints for integration

The system is now ready for development and testing!



