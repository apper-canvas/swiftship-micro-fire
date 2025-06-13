import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FleetMap = ({ drivers = [], className = '' }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });

  // Mock map component - in real app this would be Google Maps/Mapbox
  const MapPlaceholder = () => (
    <div className="relative w-full h-96 bg-surface-100 rounded-lg overflow-hidden border">
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Street overlay */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
        <path d="M50 150 Q150 100 250 150 T350 120" stroke="#e2e8f0" strokeWidth="4" fill="none"/>
        <path d="M20 200 L380 180" stroke="#e2e8f0" strokeWidth="3" fill="none"/>
        <path d="M200 50 L220 250" stroke="#e2e8f0" strokeWidth="3" fill="none"/>
      </svg>

      {/* Driver markers */}
      {drivers.map((driver, index) => {
        const x = 50 + (index * 80) + Math.sin(index) * 30;
        const y = 120 + Math.cos(index) * 40;
        
        return (
          <motion.div
            key={driver.id}
            className="absolute cursor-pointer"
            style={{
              left: `${(x / 400) * 100}%`,
              top: `${(y / 300) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`
              w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold
              ${driver.status === 'available' ? 'bg-accent' : 
                driver.status === 'busy' ? 'bg-orange-500' : 'bg-surface-400'}
            `}>
              <ApperIcon name="User" size={16} />
            </div>
            
            {/* Driver status pulse */}
            {driver.status === 'available' && (
              <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-75"></div>
            )}
          </motion.div>
        );
      })}

      {/* Map legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Busy</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-3 h-3 bg-surface-400 rounded-full"></div>
          <span>Offline</span>
        </div>
      </div>

      {/* Driver info popup */}
      {selectedDriver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-surface-900">{selectedDriver.name}</h3>
              <p className="text-sm text-surface-600">{selectedDriver.vehicleType}</p>
            </div>
            <Badge variant={selectedDriver.status}>
              {selectedDriver.status}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-surface-600">
            <div className="flex justify-between">
              <span>Today's Deliveries:</span>
              <span className="font-medium">{selectedDriver.todayStats?.deliveries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Rating:</span>
              <span className="font-medium">{selectedDriver.rating}/5.0</span>
            </div>
            <div className="flex justify-between">
              <span>Load:</span>
              <span className="font-medium">
                {selectedDriver.capacity?.currentLoad || 0}/{selectedDriver.capacity?.maxWeight || 0}kg
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1">
              Message
            </Button>
            <Button size="sm" variant="primary" className="flex-1">
              Assign Task
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-surface-900">Live Fleet Map</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon="RotateCcw">
            Refresh
          </Button>
          <Button variant="ghost" size="sm" icon="Maximize2">
            Fullscreen
          </Button>
        </div>
      </div>
      
      <MapPlaceholder />
      
      {/* Fleet stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-surface-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">
            {drivers.filter(d => d.status === 'available').length}
          </p>
          <p className="text-sm text-surface-600">Available</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">
            {drivers.filter(d => d.status === 'busy').length}
          </p>
          <p className="text-sm text-surface-600">Busy</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-surface-500">
            {drivers.filter(d => d.status === 'offline').length}
          </p>
          <p className="text-sm text-surface-600">Offline</p>
        </div>
      </div>
    </Card>
  );
};

export default FleetMap;