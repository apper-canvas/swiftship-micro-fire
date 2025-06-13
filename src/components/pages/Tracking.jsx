import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { orderService, taskService } from '@/services';
import { format } from 'date-fns';

const Tracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingNumber(id);
      handleTrack(id);
    }
  }, [searchParams]);

  const handleTrack = async (id = trackingNumber) => {
    if (!id.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Find order by tracking number
      const orders = await orderService.getAll();
      const foundOrder = orders.find(o => 
        o.trackingNumber.toLowerCase() === id.toLowerCase() ||
        o.id === id
      );
      
      if (!foundOrder) {
        throw new Error('Tracking number not found');
      }

      setOrder(foundOrder);
      
      // Get related tasks
      const allTasks = await taskService.getAll();
      const orderTasks = allTasks.filter(t => t.orderId === foundOrder.id);
      setTasks(orderTasks);
      
      // Update URL
      setSearchParams({ id });
      
    } catch (err) {
      setError(err.message || 'Failed to track package');
      setOrder(null);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getTrackingSteps = () => {
    if (!order) return [];

    const baseSteps = [
      { 
        id: 'placed', 
        title: 'Order Placed', 
        description: 'Your order has been confirmed',
        completed: true,
        timestamp: order.createdAt
      },
      { 
        id: 'pickup_scheduled', 
        title: 'Pickup Scheduled', 
        description: 'Driver assigned and pickup scheduled',
        completed: ['pickup_scheduled', 'in_transit', 'delivered'].includes(order.status),
        timestamp: order.scheduledPickup || order.pickupTime
      },
      { 
        id: 'in_transit', 
        title: 'In Transit', 
        description: 'Package is on the way to destination',
        completed: ['in_transit', 'delivered'].includes(order.status),
        timestamp: order.pickupTime
      },
      { 
        id: 'delivered', 
        title: 'Delivered', 
        description: 'Package delivered successfully',
        completed: order.status === 'delivered',
        timestamp: order.deliveredAt
      }
    ];

    if (order.status === 'failed_delivery') {
      return [
        ...baseSteps.slice(0, -1),
        { 
          id: 'failed', 
          title: 'Delivery Failed', 
          description: order.failureReason || 'Delivery attempt failed',
          completed: true,
          failed: true,
          timestamp: order.failedAt
        }
      ];
    }

    return baseSteps;
  };

  const trackingSteps = getTrackingSteps();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Track Your Package</h1>
        <p className="text-surface-600">
          Enter your tracking number to get real-time updates on your delivery
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter tracking number (e.g., SW240115001)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              icon="Search"
            />
          </div>
          <Button 
            type="submit" 
            variant="primary"
            loading={loading}
            className="px-8"
          >
            Track
          </Button>
        </form>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <SkeletonLoader count={1} />
          <div className="h-64 bg-surface-200 rounded-xl animate-pulse" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorState 
          message={error}
          onRetry={() => handleTrack()}
        />
      )}

      {/* No Search Yet */}
      {!order && !loading && !error && !trackingNumber && (
        <EmptyState
          icon="Search"
          title="Enter a tracking number"
          description="Start tracking your package by entering the tracking number above"
        />
      )}

      {/* Tracking Results */}
      {order && !loading && (
        <div className="space-y-6">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-surface-900 mb-2">
                    {order.trackingNumber}
                  </h2>
                  <p className="text-surface-600">
                    {order.customerName} • {order.customerPhone}
                  </p>
                </div>
                <Badge 
                  variant={order.status} 
                  icon={getStatusIcon(order.status)}
                  size="md"
                >
                  {order.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Addresses */}
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h3 className="font-medium text-surface-900 mb-2 flex items-center">
                    <ApperIcon name="MapPin" className="mr-2 text-primary" size={16} />
                    Pickup Address
                  </h3>
                  <p className="text-sm text-surface-600">
                    {order.pickupAddress?.street}<br />
                    {order.pickupAddress?.city}, {order.pickupAddress?.state} {order.pickupAddress?.zipCode}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-surface-900 mb-2 flex items-center">
                    <ApperIcon name="Target" className="mr-2 text-accent" size={16} />
                    Delivery Address
                  </h3>
                  <p className="text-sm text-surface-600">
                    {order.deliveryAddress?.street}<br />
                    {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
                  </p>
                </div>
              </div>

              {/* Package Info */}
              <div className="pt-4 border-t border-surface-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-surface-600">Weight:</span>
                    <p className="font-medium">{order.packageDetails?.weight}kg</p>
                  </div>
                  <div>
                    <span className="text-surface-600">Type:</span>
                    <p className="font-medium">{order.packageDetails?.type}</p>
                  </div>
                  <div>
                    <span className="text-surface-600">Price:</span>
                    <p className="font-medium">${order.price}</p>
                  </div>
                  <div>
                    <span className="text-surface-600">Driver:</span>
                    <p className="font-medium">{order.assignedDriver || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tracking Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-surface-900 mb-6">Delivery Progress</h3>
              
              <div className="space-y-6">
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${step.completed
                            ? step.failed
                              ? 'bg-red-500 text-white'
                              : 'bg-accent text-white'
                            : 'bg-surface-200 text-surface-600'
                          }
                        `}
                      >
                        <ApperIcon 
                          name={step.failed ? 'X' : step.completed ? 'Check' : 'Circle'} 
                          size={16} 
                        />
                      </motion.div>
                      {index < trackingSteps.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          step.completed ? 'bg-accent' : 'bg-surface-200'
                        }`} />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0 pb-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-medium ${
                            step.completed 
                              ? step.failed 
                                ? 'text-red-700' 
                                : 'text-surface-900'
                              : 'text-surface-600'
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-surface-600 mt-1">
                            {step.description}
                          </p>
                        </div>
                        {step.timestamp && (
                          <div className="text-xs text-surface-500 ml-4 text-right">
                            {format(new Date(step.timestamp), 'MMM d, yyyy')}<br />
                            {format(new Date(step.timestamp), 'HH:mm')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Live Map Placeholder */}
          {(order.status === 'in_transit' || order.status === 'pickup_scheduled') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-surface-900">Live Tracking</h3>
                  <Badge variant="success" icon="Navigation">
                    LIVE
                  </Badge>
                </div>
                
                {/* Mock tracking map */}
                <div className="relative w-full h-64 bg-surface-100 rounded-lg overflow-hidden border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <ApperIcon name="MapPin" size={32} className="text-primary mx-auto mb-2" />
                      <p className="text-surface-600">Live GPS tracking</p>
                      <p className="text-sm text-surface-500">
                        Your driver is {order.status === 'in_transit' ? 'en route' : 'preparing for pickup'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Animated tracking dot */}
                  <motion.div
                    animate={{ 
                      x: [50, 150, 250, 300],
                      y: [100, 80, 120, 140]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: 'linear' 
                    }}
                    className="absolute w-3 h-3 bg-primary rounded-full shadow-lg"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-surface-600">
                  <span>Estimated arrival: {order.estimatedDelivery ? format(new Date(order.estimatedDelivery), 'HH:mm') : 'Calculating...'}</span>
                  <Button variant="ghost" size="sm" icon="RefreshCw">
                    Refresh
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-surface-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-surface-900 mb-1">Need Help?</h3>
                  <p className="text-sm text-surface-600">
                    Our support team is here to help with any questions about your delivery
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon="MessageCircle">
                    Chat Support
                  </Button>
                  <Button variant="outline" size="sm" icon="Phone">
                    Call
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Tracking;