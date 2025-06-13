import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  onFilter,
  showFilters = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            icon="Search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          type="submit"
          variant="primary"
          className="px-6"
        >
          Search
        </Button>
        
        {showFilters && (
          <Button
            variant="outline"
            icon="Filter"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters
          </Button>
        )}
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: filtersOpen ? 'auto' : 0,
            opacity: filtersOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-surface-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Status
                </label>
                <select className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Date Range
                </label>
                <select className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onFilter?.()}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;