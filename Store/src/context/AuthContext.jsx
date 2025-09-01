import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Mock login logic - determine role based on email
      let role = "Normal User";
      if (email?.includes("admin")) role = "System Administrator";
      if (email?.includes("store")) role = "Store Owner";

      const user = {
        id: Date.now(),
        email,
        role,
        name: email.split("@")[0], // Simple name extraction for demo
      };

      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const user = {
        id: Date.now(),
        ...userData,
        role: "Normal User", // Default role for new signups
      };

      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      // In a real application, you would verify the current password with the backend
      // For this demo, we'll assume the current password is correct
      // and just update the user's password (in a real app, this would be saved to database)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real application, you would:
      // 1. Verify current password against stored hash
      // 2. Hash the new password
      // 3. Update in database
      // 4. Return success/failure
      
      return { success: true, message: "Password updated successfully!" };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    updatePassword,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
