import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const OrderCard = ({ order, onViewDetails, onTrack, className = '' }) => {
  const getStatusIcon = (status) => {
    const icons = {
      pending: 'Clock',
      pickup_scheduled: 'Calendar',
      in_transit: 'Truck',
      delivered: 'CheckCircle',
      failed_delivery: 'XCircle'
    };
    return icons[status] || 'Package';
  };

  const getUrgencyColor = (urgent) => urgent ? 'error' : 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card hover className="relative">
        {/* Urgent indicator */}
        {order.packageDetails?.urgent && (
          <div className="absolute top-4 right-4">
            <ApperIcon name="Zap" className="text-red-500" size={16} />
          </div>
        )}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-1">
                {order.trackingNumber}
              </h3>
              <p className="text-sm text-surface-600">
                {order.customerName} • {order.customerPhone}
              </p>
            </div>
            <Badge variant={order.status} icon={getStatusIcon(order.status)}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-surface-900">Pickup</p>
                <p className="text-sm text-surface-600">
                  {order.pickupAddress?.street}, {order.pickupAddress?.city}
                </p>
              </div>
            </div>
            
            <div className="ml-1 border-l-2 border-dashed border-surface-200 h-4"></div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-surface-900">Delivery</p>
                <p className="text-sm text-surface-600">
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Package details */}
          <div className="flex items-center justify-between text-sm text-surface-600">
            <div className="flex items-center space-x-4">
              <span>{order.packageDetails?.weight}kg</span>
              <span>{order.packageDetails?.type}</span>
              {order.packageDetails?.fragile && (
                <Badge size="xs" variant="warning" icon="AlertTriangle">
                  Fragile
                </Badge>
              )}
            </div>
            <span className="font-semibold text-surface-900">${order.price}</span>
          </div>

          {/* Time info */}
          <div className="text-sm text-surface-600">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{format(new Date(order.createdAt), 'MMM d, HH:mm')}</span>
            </div>
            {order.estimatedDelivery && (
              <div className="flex justify-between">
                <span>Est. Delivery:</span>
                <span>{format(new Date(order.estimatedDelivery), 'MMM d, HH:mm')}</span>
              </div>
            )}
            {order.assignedDriver && (
              <div className="flex justify-between">
                <span>Driver:</span>
                <span>{order.assignedDriver}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-surface-100">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails?.(order)}
            >
              Details
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-1"
              icon="MapPin"
              onClick={() => onTrack?.(order)}
            >
              Track
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default OrderCard;