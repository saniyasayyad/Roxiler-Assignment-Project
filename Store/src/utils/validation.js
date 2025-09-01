// Form validation utilities
export const validateForm = (data, type) => {
  const errors = {};
  
  // Name validation for signup, addUser, and addStore
  if (type === 'signup' || type === 'addUser' || type === 'addStore') {
    const nameField = type === 'addUser' ? data.addName : 
                     type === 'addStore' ? data.addStoreName : data.name;
    if (!nameField || nameField.length < 20 || nameField.length > 60) {
      errors.name = 'Name must be between 20-60 characters';
    }
    
    const addressField = type === 'addUser' ? data.addAddress : 
                        type === 'addStore' ? data.addStoreAddress : data.address;
    if (!addressField) {
      errors.address = 'Address is required';
    } else if (addressField.length > 400) {
      errors.address = 'Address must not exceed 400 characters';
    }
  }
  
  // Email validation
  if (type === 'signup' || type === 'addUser' || type === 'addStore') {
    const emailField = type === 'addUser' ? data.addEmail : 
                      type === 'addStore' ? data.addStoreEmail : data.email;
    if (!emailField) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
      errors.email = 'Please enter a valid email address';
    }
  }
  
  // Password validation for signup and addUser
  if (type === 'signup' || type === 'addUser') {
    const passwordField = type === 'addUser' ? data.addPassword : data.password;
    if (!passwordField) {
      errors.password = 'Password is required';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(passwordField)) {
      errors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    }
  }
  
  // Role validation for addUser
  if (type === 'addUser') {
    if (!data.addRole) {
      errors.role = 'Role is required';
    }
  }
  
  // Password confirmation validation
  if (type === 'signup') {
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
  return passwordRegex.test(password);
};

export const validateName = (name) => {
  return name && name.length >= 20 && name.length <= 60;
};

export const validateAddress = (address) => {
  return address && address.length <= 400;
};

export const validatePasswordUpdate = (formData) => {
  const errors = {};
  
  // Current password validation
  if (!formData.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  
  // New password validation
  if (!formData.newPassword) {
    errors.newPassword = "New password is required";
  } else if (!validatePassword(formData.newPassword)) {
    errors.newPassword = "Password must be 8-16 characters with at least one uppercase letter and one special character";
  }
  
  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  // Check if new password is different from current
  if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
    errors.newPassword = "New password must be different from current password";
  }
  
  return errors;
};
