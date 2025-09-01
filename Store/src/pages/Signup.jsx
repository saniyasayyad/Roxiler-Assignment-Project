import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { validateForm } from "../utils/validation";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, "signup");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const result = await signup(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrors({ submit: result.error });
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
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 w-full max-w-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-18 h-18 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
            <Store className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            Create Account
          </h1>
          <p className="text-slate-600 font-medium text-base">
            Join our store rating platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
              required
            />
          </div>

          <Input
            label="Address"
            type="textarea"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleInputChange("address")}
            error={errors.address}
            required
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Password"
              placeholder="8-16 chars, 1 uppercase, 1 special"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={errors.password}
              required
              showPasswordToggle
              showPassword={showPassword}
              onPasswordToggle={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={errors.confirmPassword}
              required
            />
          </div>

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
            className="w-full mt-6"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:underline decoration-2 underline-offset-4 cursor-pointer"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
