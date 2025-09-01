import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (currentUser) {
    const dashboardPath =
      currentUser.role === "System Administrator"
        ? "/admin"
        : currentUser.role === "Store Owner"
        ? "/store"
        : "/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const validationErrors = {};
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Navigate to appropriate dashboard
      const dashboardPath =
        result.user.role === "System Administrator"
          ? "/admin"
          : result.user.role === "Store Owner"
          ? "/store"
          : "/dashboard";
      navigate(dashboardPath);
    } else {
      setErrors({ submit: result.error || "Login failed. Please try again." });
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
            <Store className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Store Rating System
          </h1>
          <p className="text-slate-600 font-medium text-base">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange("email")}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange("password")}
            error={errors.password}
            required
            showPasswordToggle
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword(!showPassword)}
          />

          {errors.submit && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl animate-slide-up">
              <p className="text-red-700 text-sm font-medium flex items-center">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                {errors.submit}
              </p>
            </div>
          )}

          <Button
            type="submit"
            size="large"
            loading={isLoading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:underline decoration-2 underline-offset-4 cursor-pointer"
          >
            Don't have an account? Sign up
          </Link>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <p className="font-bold text-slate-700 mb-3 text-sm">
            Demo Accounts:
          </p>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
              <span className="font-medium">Admin:</span>
              <span className="font-mono bg-slate-200 px-2 py-1 rounded text-slate-700">
                admin@system.com
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
              <span className="font-medium">Store Owner:</span>
              <span className="font-mono bg-slate-200 px-2 py-1 rounded text-slate-700">
                store@owner.com
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
              <span className="font-medium">Normal User:</span>
              <span className="font-mono bg-slate-200 px-2 py-1 rounded text-slate-700">
                user@normal.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
