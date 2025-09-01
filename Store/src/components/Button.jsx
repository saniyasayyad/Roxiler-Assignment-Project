import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/25 hover:shadow-blue-500/40',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-slate-200/50 hover:shadow-slate-300/60',
    accent: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-500/25 hover:shadow-purple-500/40',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/25 hover:shadow-red-500/40',
    ghost: 'text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 shadow-none hover:shadow-md',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40'
  };
  
  const sizeClasses = {
    small: 'px-5 py-2.5 text-sm font-medium min-h-[40px]',
    medium: 'px-6 py-3.5 text-base font-medium min-h-[48px]',
    large: 'px-8 py-4 text-lg font-semibold min-h-[56px]'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {/* Shimmer effect for primary buttons */}
          {(variant === 'primary' || variant === 'accent') && !disabled && (
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000"></div>
          )}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
