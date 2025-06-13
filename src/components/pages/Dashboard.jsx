import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatusCard from '@/components/molecules/StatusCard';
import FleetMap from '@/components/organisms/FleetMap';
import OrderCard from '@/components/molecules/OrderCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { orderService, driverService, analyticsService } from '@/services';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [analyticsData, ordersData, driversData] = await Promise.all([
        analyticsService.getOverview(),
        orderService.getAll(),
        driverService.getAll()
      ]);
      
      setAnalytics(analyticsData);
      setRecentOrders(ordersData.slice(0, 5)); // Latest 5 orders
      setDrivers(driversData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderView = (order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleOrderTrack = (order) => {
    navigate(`/tracking?id=${order.trackingNumber}`);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-96 bg-surface-200 rounded-xl animate-pulse" />
          <SkeletonLoader count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600">Monitor your courier operations in real-time</p>
        </div>
        <div className="text-sm text-surface-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatusCard
            title="Today's Orders"
            value={analytics?.todayOrders || 0}
            change={`+${analytics?.weeklyGrowth || 0}%`}
            trend="up"
            icon="Package"
            color="primary"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatusCard
            title="Active Drivers"
            value={analytics?.activeDrivers || 0}
            icon="Truck"
            color="accent"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatusCard
            title="On-Time Rate"
            value={`${analytics?.onTimeDeliveries || 0}%`}
            change="+2.1%"
            trend="up"
            icon="Clock"
            color="secondary"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatusCard
            title="Total Revenue"
            value={`$${(analytics?.totalRevenue || 0).toLocaleString()}`}
            change="+18.3%"
            trend="up"
            icon="DollarSign"
            color="accent"
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fleet Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FleetMap drivers={drivers} />
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">Recent Orders</h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-primary hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
              >
                <OrderCard
                  order={order}
                  onViewDetails={handleOrderView}
                  onTrack={handleOrderTrack}
                />
              </motion.div>
            ))}
            
            {recentOrders.length === 0 && (
              <div className="text-center py-8 text-surface-500">
                No recent orders found
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl border border-surface-200 p-6"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900 mb-1">
              {analytics?.averageDeliveryTime || 0}min
            </div>
            <div className="text-sm text-surface-600">Avg Delivery Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900 mb-1">
              {analytics?.customerSatisfaction || 0}/5
            </div>
            <div className="text-sm text-surface-600">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900 mb-1">
              {analytics?.totalOrders || 0}
            </div>
            <div className="text-sm text-surface-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900 mb-1">
              {((analytics?.todayOrders || 0) / (analytics?.yesterdayOrders || 1) * 100 - 100).toFixed(1)}%
            </div>
            <div className="text-sm text-surface-600">Growth Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;