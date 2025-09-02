import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Header = ({ title }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
           
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
              <Store className="text-white text-2xl" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">{title}</h1>
              {currentUser && (
                <div className="flex items-center space-x-3 mt-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                    {currentUser.role}
                  </span>
                  <span className="text-sm text-slate-600 font-medium truncate max-w-xs">{currentUser.email}</span>
                </div>
              )}
            </div>
          </div>
          
          {currentUser && (
            <div className="flex items-center space-x-3 ml-4">
             
              <div className="w-11 h-11 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer flex-shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
              </div>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 !px-4 !py-3 rounded-xl transition-all duration-300 !shadow-none hover:!shadow-md flex-shrink-0 !min-h-[44px]"
                size="small"
              >
                <LogOut size={18} className="flex-shrink-0" />
                <span className="hidden sm:inline font-medium leading-none">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
   
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60"></div>
    </div>
  );
};

export default Header;
