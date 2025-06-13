import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import OrderList from '@/components/organisms/OrderList';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { orderService } from '@/services';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ordersData = await orderService.getAll();
      setOrders(ordersData);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-surface-900">Orders</h1>
        </div>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Orders</h1>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadOrders}
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
          <h1 className="text-2xl font-bold text-surface-900">Orders</h1>
          <p className="text-surface-600">
            Manage and track all delivery orders
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-surface-600">
          <span>Total: {orders.length}</span>
          <span>•</span>
          <span>In Transit: {orders.filter(o => o.status === 'in_transit').length}</span>
          <span>•</span>
          <span>Delivered: {orders.filter(o => o.status === 'delivered').length}</span>
        </div>
      </div>

      {/* Orders List */}
      <OrderList 
        orders={orders}
        loading={loading}
        onRefresh={loadOrders}
      />
    </motion.div>
  );
};

export default Orders;