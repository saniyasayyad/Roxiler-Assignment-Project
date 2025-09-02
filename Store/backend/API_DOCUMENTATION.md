# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

Register a new normal user account.

**Request Body:**
```json
{
  "name": "John Doe Sample User Name",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "address": "123 Main Street, City, State 12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe Sample User Name",
      "email": "john@example.com",
      "role": "Normal User",
      "address": "123 Main Street, City, State 12345"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "admin@system.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "System Administrator Default User",
      "email": "admin@system.com",
      "role": "System Administrator",
      "address": "100 Admin Street, System City, Admin State 12345"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 Get User Profile
**GET** `/auth/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "System Administrator Default User",
      "email": "admin@system.com",
      "role": "System Administrator",
      "address": "100 Admin Street, System City, Admin State 12345",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 1.4 Update Password
**PUT** `/auth/password`

Update user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "Admin@123",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 2. Admin Endpoints

*All admin endpoints require System Administrator role.*

### 2.1 Get Dashboard Statistics
**GET** `/admin/dashboard/stats`

Get overall system statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 5,
    "totalStores": 3,
    "totalRatings": 12
  }
}
```

### 2.2 Get All Users
**GET** `/admin/users`

Get all users with optional filtering and sorting.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `searchTerm` (optional): Search term
- `filterBy` (optional): Field to filter by (name, email, address, role)
- `sortBy` (optional): Field to sort by (name, email, address, role, created_at)
- `sortOrder` (optional): Sort order (ASC, DESC)

**Example:**
```
GET /admin/users?searchTerm=admin&filterBy=role&sortBy=created_at&sortOrder=DESC
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "System Administrator Default User",
        "email": "admin@system.com",
        "address": "100 Admin Street, System City, Admin State 12345",
        "role": "System Administrator",
        "created_at": "2024-01-01T00:00:00.000Z",
        "rating": null
      }
    ]
  }
}
```

### 2.3 Get User by ID
**GET** `/admin/users/:id`

Get detailed information about a specific user.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "System Administrator Default User",
      "email": "admin@system.com",
      "address": "100 Admin Street, System City, Admin State 12345",
      "role": "System Administrator",
      "created_at": "2024-01-01T00:00:00.000Z",
      "rating": null,
      "ratings": [
        {
          "id": 1,
          "rating": 5,
          "created_at": "2024-01-01T00:00:00.000Z",
          "store_name": "Tech Electronics Store"
        }
      ]
    }
  }
}
```

### 2.4 Add New User
**POST** `/admin/users`

Add a new user (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Store Owner Sample User",
  "email": "newstore@owner.com",
  "password": "SecurePass123!",
  "address": "500 New Store Street, Business District, State 54321",
  "role": "Store Owner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User added successfully",
  "data": {
    "user": {
      "id": 6,
      "name": "New Store Owner Sample User",
      "email": "newstore@owner.com",
      "role": "Store Owner",
      "address": "500 New Store Street, Business District, State 54321",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2.5 Get All Stores
**GET** `/admin/stores`

Get all stores with optional filtering and sorting.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `searchTerm` (optional): Search term
- `filterBy` (optional): Field to filter by (name, email, address)
- `sortBy` (optional): Field to sort by (name, email, address, average_rating, total_ratings, created_at)
- `sortOrder` (optional): Sort order (ASC, DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": 1,
        "name": "Tech Electronics Store Sample Store",
        "email": "tech@store.com",
        "address": "123 Tech Street, Silicon Valley, Tech State 11111",
        "created_at": "2024-01-01T00:00:00.000Z",
        "average_rating": "4.2",
        "total_ratings": "3"
      }
    ]
  }
}
```

### 2.6 Get Store by ID
**GET** `/admin/stores/:id`

Get detailed information about a specific store.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": 1,
      "name": "Tech Electronics Store Sample Store",
      "email": "tech@store.com",
      "address": "123 Tech Street, Silicon Valley, Tech State 11111",
      "created_at": "2024-01-01T00:00:00.000Z",
      "average_rating": "4.2",
      "total_ratings": "3",
      "ratings": [
        {
          "id": 1,
          "rating": 5,
          "created_at": "2024-01-01T00:00:00.000Z",
          "user_name": "Jane Normal User Johnson"
        }
      ]
    }
  }
}
```

### 2.7 Add New Store
**POST** `/admin/stores`

Add a new store (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Electronics Store Sample Store",
  "email": "newelectronics@store.com",
  "address": "600 Electronics Avenue, Tech District, State 65432"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Store added successfully",
  "data": {
    "store": {
      "id": 4,
      "name": "New Electronics Store Sample Store",
      "email": "newelectronics@store.com",
      "address": "600 Electronics Avenue, Tech District, State 65432",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 3. Store Endpoints (Normal Users)

*These endpoints are available to Normal Users and System Administrators.*

### 3.1 Get Stores for User
**GET** `/stores`

Get all stores with user's rating if exists.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Query Parameters:**
- `searchTerm` (optional): Search term
- `filterBy` (optional): Field to filter by (name, address)
- `sortBy` (optional): Field to sort by (name, address, average_rating, total_ratings, created_at)
- `sortOrder` (optional): Sort order (ASC, DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": 1,
        "name": "Tech Electronics Store Sample Store",
        "email": "tech@store.com",
        "address": "123 Tech Street, Silicon Valley, Tech State 11111",
        "created_at": "2024-01-01T00:00:00.000Z",
        "average_rating": "4.2",
        "total_ratings": "3",
        "user_rating": 5
      }
    ]
  }
}
```

### 3.2 Submit Rating
**POST** `/stores/ratings`

Submit or update a rating for a store.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "storeId": 1,
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted successfully"
}
```

### 3.3 Get User's Ratings
**GET** `/stores/ratings`

Get all ratings submitted by the current user.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "id": 1,
        "rating": 5,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "store_id": 1,
        "store_name": "Tech Electronics Store Sample Store",
        "store_address": "123 Tech Street, Silicon Valley, Tech State 11111"
      }
    ]
  }
}
```

---

## 4. Store Owner Endpoints

*These endpoints are available only to Store Owners.*

### 4.1 Get Store Owner Dashboard
**GET** `/store-owner/dashboard`

Get dashboard data for store owner.

**Headers:**
```
Authorization: Bearer <store_owner_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": 1,
        "name": "Tech Electronics Store Sample Store",
        "email": "tech@store.com",
        "address": "123 Tech Street, Silicon Valley, Tech State 11111",
        "created_at": "2024-01-01T00:00:00.000Z",
        "average_rating": "4.2",
        "total_ratings": "3"
      }
    ],
    "ratings": [
      {
        "id": 1,
        "rating": 5,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "store_id": 1,
        "store_name": "Tech Electronics Store Sample Store",
        "user_id": 2,
        "user_name": "Jane Normal User Johnson",
        "user_email": "jane@email.com"
      }
    ],
    "statistics": {
      "totalStores": 1,
      "totalRatings": 3,
      "averageRating": 4.2
    }
  }
}
```

### 4.2 Get Store Ratings
**GET** `/store-owner/stores/:storeId/ratings`

Get detailed ratings for a specific store owned by the user.

**Headers:**
```
Authorization: Bearer <store_owner_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": 1,
      "name": "Tech Electronics Store Sample Store",
      "email": "tech@store.com",
      "address": "123 Tech Street, Silicon Valley, Tech State 11111",
      "created_at": "2024-01-01T00:00:00.000Z",
      "average_rating": "4.2",
      "total_ratings": "3"
    },
    "ratings": [
      {
        "id": 1,
        "rating": 5,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "user_id": 2,
        "user_name": "Jane Normal User Johnson",
        "user_email": "jane@email.com",
        "user_address": "200 User Avenue, Normal Town, User State 54321"
      }
    ],
    "ratingDistribution": {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 1,
      "5": 2
    }
  }
}
```

### 4.3 Get Store Raters
**GET** `/store-owner/raters`

Get users who rated stores owned by this user.

**Headers:**
```
Authorization: Bearer <store_owner_token>
```

**Query Parameters:**
- `searchTerm` (optional): Search term
- `filterBy` (optional): Field to filter by (name, email, address)
- `sortBy` (optional): Field to sort by (name, email, address, total_ratings_given, average_rating_given, last_rating_date)
- `sortOrder` (optional): Sort order (ASC, DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 2,
        "name": "Jane Normal User Johnson Sample User",
        "email": "jane@email.com",
        "address": "200 User Avenue, Normal Town, User State 54321",
        "role": "Normal User",
        "total_ratings_given": "3",
        "average_rating_given": "4.3",
        "last_rating_date": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "User not found"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Authentication Required)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Window**: 15 minutes
- **Limit**: 100 requests per IP address
- **Headers**: Rate limit information is included in response headers

---

## Testing the API

You can test the API using tools like:
- **Postman**
- **cURL**
- **Insomnia**
- **Thunder Client (VS Code Extension)**

### Example cURL Commands

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@system.com", "password": "Admin@123"}'
```

**Get Dashboard Stats:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Submit Rating:**
```bash
curl -X POST http://localhost:5000/api/stores/ratings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"storeId": 1, "rating": 5}'
```



