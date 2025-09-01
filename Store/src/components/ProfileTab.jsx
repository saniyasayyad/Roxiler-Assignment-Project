import React, { useState, useCallback } from 'react';
import { User, Mail, MapPin, Shield, Store as StoreIcon, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from './Input';
import Button from './Button';
import { validatePasswordUpdate } from '../utils/validation';

const ProfileTab = ({ passwordForm, setPasswordForm }) => {
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentUser, updatePassword, isLoading } = useAuth();

  const handlePasswordFormChange = useCallback((field) => (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [setPasswordForm, errors]);

  const handlePasswordUpdate = useCallback(async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validatePasswordUpdate(passwordForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    
    // Call the updatePassword function from AuthContext
    const result = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
    
    if (result.success) {
      alert(result.message);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({}); // Clear any existing errors
      // Reset password visibility
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } else {
      setErrors({ submit: result.error });
    }
  }, [passwordForm, updatePassword, setPasswordForm]);

  // Get role-specific icon and color
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'System Administrator':
        return {
          icon: Shield,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'from-purple-100 to-purple-200',
          textColor: 'text-purple-800'
        };
      case 'Store Owner':
        return {
          icon: StoreIcon,
          color: 'from-emerald-500 to-emerald-600',
          bgColor: 'from-emerald-100 to-emerald-200',
          textColor: 'text-emerald-800'
        };
      case 'Normal User':
      default:
        return {
          icon: Users,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-100 to-blue-200',
          textColor: 'text-blue-800'
        };
    }
  };

  const roleDisplay = getRoleDisplay(currentUser?.role);
  const RoleIcon = roleDisplay.icon;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Details Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${roleDisplay.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <RoleIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Profile Details
            </h3>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Full Name</p>
                <p className="text-lg font-semibold text-slate-800">{currentUser?.name || 'N/A'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Email Address</p>
                <p className="text-lg font-semibold text-slate-800 font-mono">{currentUser?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Address</p>
                <p className="text-lg font-semibold text-slate-800">{currentUser?.address || 'N/A'}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
              <div className={`w-12 h-12 bg-gradient-to-br ${roleDisplay.color} rounded-xl flex items-center justify-center`}>
                <RoleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Role</p>
                <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${roleDisplay.bgColor} ${roleDisplay.textColor}`}>
                  {currentUser?.role || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Update Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0-6v2m0-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Update Password
            </h3>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFormChange('currentPassword')}
              error={errors.currentPassword}
              required
              showPasswordToggle={true}
              showPassword={showCurrentPassword}
              onPasswordToggle={() => setShowCurrentPassword(!showCurrentPassword)}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="8-16 chars, 1 uppercase, 1 special"
              value={passwordForm.newPassword}
              onChange={handlePasswordFormChange('newPassword')}
              error={errors.newPassword}
              required
              showPasswordToggle={true}
              showPassword={showNewPassword}
              onPasswordToggle={() => setShowNewPassword(!showNewPassword)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordFormChange('confirmPassword')}
              error={errors.confirmPassword}
              required
              showPasswordToggle={true}
              showPassword={showConfirmPassword}
              onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {errors.submit && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl animate-slide-up">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  {errors.submit}
                </p>
              </div>
            )}

            <Button type="submit" size="large" className="w-full" loading={isLoading}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
