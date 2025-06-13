import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FleetMap from '@/components/organisms/FleetMap';
import EmptyState from '@/components/organisms/EmptyState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { driverService } from '@/services';

const Fleet = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const driversData = await driverService.getAll();
      setDrivers(driversData);
      setFilteredDrivers(driversData);
    } catch (err) {
      setError(err.message || 'Failed to load fleet data');
      toast.error('Failed to load fleet data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredDrivers(drivers);
      return;
    }
    
    const filtered = drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  const getVehicleIcon = (vehicleType) => {
    const icons = {
      van: 'Truck',
      car: 'Car',
      motorcycle: 'Bike',
      bicycle: 'Bike'
    };
    return icons[vehicleType.toLowerCase()] || 'Truck';
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'accent',
      busy: 'warning',
      offline: 'default'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-surface-900">Fleet Management</h1>
        </div>
        <div className="h-96 bg-surface-200 rounded-xl animate-pulse" />
        <SkeletonLoader count={4} type="row" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Fleet Management</h1>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadDrivers}
        />
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Fleet Management</h1>
        </div>
        <EmptyState
          icon="Truck"
          title="No drivers found"
          description="Add drivers to your fleet to start managing deliveries"
          actionLabel="Add Driver"
          onAction={() => toast.info('Driver management coming soon')}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Fleet Management</h1>
          <p className="text-surface-600">
            Monitor and manage your delivery fleet in real-time
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center bg-surface-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <ApperIcon name="Grid3X3" size={16} className="mr-1" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'map' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <ApperIcon name="Map" size={16} className="mr-1" />
            Map
          </button>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-accent mb-1">
            {drivers.filter(d => d.status === 'available').length}
          </div>
          <div className="text-sm text-surface-600">Available</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-500 mb-1">
            {drivers.filter(d => d.status === 'busy').length}
          </div>
          <div className="text-sm text-surface-600">Busy</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-surface-500 mb-1">
            {drivers.filter(d => d.status === 'offline').length}
          </div>
          <div className="text-sm text-surface-600">Offline</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {drivers.reduce((acc, d) => acc + (d.todayStats?.deliveries || 0), 0)}
          </div>
          <div className="text-sm text-surface-600">Today's Deliveries</div>
        </Card>
      </div>

      {viewMode === 'map' ? (
        /* Map View */
        <FleetMap drivers={filteredDrivers} />
      ) : (
        /* Grid View */
        <div className="space-y-6">
          <SearchBar
            placeholder="Search drivers by name, vehicle, or license plate..."
            onSearch={handleSearch}
            showFilters={true}
          />

          <div className="grid gap-4">
            {filteredDrivers.map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Driver Avatar */}
                      <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-surface-600" />
                      </div>
                      
                      {/* Driver Info */}
                      <div>
                        <h3 className="font-semibold text-surface-900">{driver.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-surface-600">
                          <ApperIcon name={getVehicleIcon(driver.vehicleType)} size={14} />
                          <span>{driver.vehicleType}</span>
                          <span>•</span>
                          <span>{driver.licensePlate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Stats */}
                    <div className="flex items-center space-x-6">
                      {/* Today's Stats */}
                      <div className="hidden md:block text-right text-sm">
                        <div className="text-surface-900 font-medium">
                          {driver.todayStats?.deliveries || 0} deliveries
                        </div>
                        <div className="text-surface-600">
                          ${(driver.todayStats?.earnings || 0).toFixed(2)} earned
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="hidden sm:flex items-center text-sm">
                        <ApperIcon name="Star" size={14} className="text-yellow-500 mr-1" />
                        <span className="font-medium">{driver.rating}</span>
                      </div>

                      {/* Status Badge */}
                      <Badge variant={getStatusColor(driver.status)}>
                        {driver.status.toUpperCase()}
                      </Badge>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" icon="MessageCircle">
                          Message
                        </Button>
                        <Button variant="outline" size="sm" icon="UserCheck">
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden mt-4 pt-4 border-t border-surface-200 flex justify-between text-sm">
                    <div>
                      <span className="text-surface-600">Deliveries: </span>
                      <span className="font-medium">{driver.todayStats?.deliveries || 0}</span>
                    </div>
                    <div>
                      <span className="text-surface-600">Earnings: </span>
                      <span className="font-medium">${(driver.todayStats?.earnings || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Star" size={14} className="text-yellow-500 mr-1" />
                      <span className="font-medium">{driver.rating}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Fleet;