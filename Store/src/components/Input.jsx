import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  showPasswordToggle = false,
  onPasswordToggle,
  showPassword = false,
  rows,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const baseClasses = `w-full px-4 py-3.5 border rounded-xl transition-all duration-300 placeholder-slate-400 bg-white/90 backdrop-blur-sm ${
    showPasswordToggle ? 'pr-12' : ''
  } ${
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 shadow-lg shadow-red-500/10' 
      : isFocused
        ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/10 transform scale-[1.01]'
        : hasValue
          ? 'border-slate-300 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
  } ${className}`;

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    if (props.onBlur) props.onBlur(e);
  };

  const inputElement = type === 'textarea' ? (
    <textarea
      required={required}
      className={baseClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      rows={rows || 3}
      {...props}
    />
  ) : (
    <input
      type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
      required={required}
      className={baseClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium transition-colors duration-200 ${
          error ? 'text-red-700' : isFocused ? 'text-blue-700' : 'text-slate-700'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {inputElement}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 transition-all duration-200 hover:scale-110 rounded-lg hover:bg-slate-100 cursor-pointer ${
              error ? 'text-red-400 hover:text-red-600' : 'text-slate-400 hover:text-slate-600 group-focus-within:text-blue-500'
            }`}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        
        {/* Focus indicator */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-all duration-300 pointer-events-none ${
          isFocused ? 'opacity-100' : ''
        }`} />
      </div>
      
      {error && (
        <p className="text-red-600 text-sm flex items-center space-x-1 animate-slide-up">
          <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Input;
