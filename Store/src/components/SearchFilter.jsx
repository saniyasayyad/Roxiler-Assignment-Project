import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filterBy, 
  onFilterChange,
  filterOptions = [],
  placeholder = "Search...",
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300 z-10" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white/90 backdrop-blur-sm transition-all duration-300 placeholder-slate-400 text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-md focus:shadow-lg focus:shadow-blue-500/10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {filterOptions.length > 0 && (
        <div className="relative group sm:min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300 z-10" size={20} />
          <select
            className="w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white/90 backdrop-blur-sm transition-all duration-300 text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-md focus:shadow-lg appearance-none cursor-pointer"
            value={filterBy}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="">Filter by...</option>
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
