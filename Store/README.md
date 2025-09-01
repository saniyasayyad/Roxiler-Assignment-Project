# Store Rating System - Demo Login

A React-based store rating system with role-based authentication and user dashboards. This demo application showcases different user roles and their respective permissions within a store rating platform.

## 🚀 Features

- **Multi-role Authentication System**
  - System Administrator
  - Store Owner 
  - Normal User
- **Role-based Dashboards**
- **Store Rating System**
- **User Management (Admin)**
- **Responsive Design with Tailwind CSS**
- **Modern UI with Gradient Backgrounds**
- **Password Management**
- **Real-time Search and Filtering**

## 🎯 Demo Accounts

The application comes with pre-configured demo accounts for testing different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **System Administrator** | `admin@system.com` | `password` | Full system access, user management |
| **Store Owner** | `store@owner.com` | `password` | Store performance analytics, ratings overview |
| **Normal User** | `user@normal.com` | `password` | Browse and rate stores |

> **Note**: All demo accounts use the password `password` for simplicity.

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 4.1.12
- **Icons**: Lucide React
- **Build Tool**: Vite 7.1.2
- **Development**: ESLint for code quality

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx       # Custom button component
│   ├── Header.jsx       # Navigation header
│   ├── Input.jsx        # Form input component
│   ├── Loading.jsx      # Loading spinner
│   ├── ProtectedRoute.jsx # Route protection wrapper
│   ├── SearchFilter.jsx # Search and filter component
│   └── StarRating.jsx   # Interactive star rating
├── context/
│   └── AuthContext.jsx  # Authentication context provider
├── hooks/
│   └── useData.js       # Custom data fetching hooks
├── pages/               # Main application pages
│   ├── AdminDashboard.jsx    # System admin interface
│   ├── Login.jsx             # Login page
│   ├── Signup.jsx            # User registration
│   ├── StoreDashboard.jsx    # Store owner interface
│   └── UserDashboard.jsx     # Normal user interface
├── services/
│   └── dataService.js   # API service layer
├── utils/
│   └── validation.js    # Form validation utilities
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint code analysis

## 🔐 Authentication System

The authentication system is implemented using React Context and provides:

### Login Process
1. User enters email and password on login page
2. System determines role based on email domain/prefix
3. User is redirected to appropriate dashboard
4. Protected routes ensure only authorized users access specific pages

### Role-based Access Control
- **System Administrator**: Access to `/admin` dashboard with user management
- **Store Owner**: Access to `/store` dashboard with store analytics
- **Normal User**: Access to `/dashboard` for browsing and rating stores

## 📱 User Interfaces

### Login Page (`/login`)
- Clean, modern design with gradient backgrounds
- Form validation and error handling
- Demo account credentials displayed
- Responsive layout for mobile and desktop

### Admin Dashboard (`/admin`)
- User statistics and management
- Add new users with role assignment
- System-wide analytics
- User search and filtering

### Store Owner Dashboard (`/store`)
- Store performance metrics
- Rating analytics and trends
- Monthly statistics
- Customer feedback overview

### User Dashboard (`/dashboard`)
- Browse available stores
- Submit and update store ratings
- Search and filter stores
- Interactive star rating system

## 🔧 Configuration

### Environment Setup
The application uses Vite for build configuration. Modify `vite.config.js` for custom build settings.

### Styling
- Tailwind CSS for utility-first styling
- Custom gradients and animations
- Responsive breakpoints
- Dark/light mode ready (can be extended)

## 🧪 Development Notes

### Mock Authentication
This is a demo application with mock authentication:
- No backend API required
- User sessions are stored in component state
- Roles determined by email patterns
- Suitable for development and demonstration purposes

### Data Services
The `dataService.js` provides mock data for:
- User information
- Store listings
- Rating data
- Static data simulation

## 🔄 Future Enhancements

Potential improvements for a production version:

- [ ] Backend API integration
- [ ] Real user authentication with JWT
- [ ] Database persistence
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Advanced admin controls
- [ ] Store image uploads
- [ ] Advanced analytics and reports
- [ ] Real-time notifications

## 📄 License

This project is a demonstration application. Please check with the project maintainer for license information.

## 🤝 Contributing

This is a demo project. For contributing guidelines, please contact the project maintainer.

---

**Built with ❤️ using React and Tailwind CSS**
