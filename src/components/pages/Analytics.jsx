import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import StatusCard from '@/components/molecules/StatusCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { analyticsService } from '@/services';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [deliveryStats, setDeliveryStats] = useState(null);
  const [driverPerformance, setDriverPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [overviewData, statsData, performanceData] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getDeliveryStats(selectedPeriod),
        analyticsService.getDriverPerformance()
      ]);
      
      setAnalytics(overviewData);
      setDeliveryStats(statsData);
      setDriverPerformance(performanceData);
    } catch (err) {
      setError(err.message || 'Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const deliveryChartOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    colors: ['#10B981', '#EF4444', '#F59E0B'],
    stroke: { width: 3, curve: 'smooth' },
    grid: { borderColor: '#f1f5f9' },
    xaxis: {
      categories: deliveryStats?.labels || [],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: '#64748b' }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' }
    }
  };

  const deliveryChartSeries = [
    { name: 'Completed', data: deliveryStats?.completed || [] },
    { name: 'Failed', data: deliveryStats?.failed || [] },
    { name: 'Pending', data: deliveryStats?.pending || [] }
  ];

  const performanceChartOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    colors: ['#2563EB'],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true }
    },
    grid: { borderColor: '#f1f5f9' },
    xaxis: {
      categories: driverPerformance.map(d => d.name) || [],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' }
    }
  };

  const performanceChartSeries = [{
    name: 'Deliveries',
    data: driverPerformance.map(d => d.deliveries) || []
  }];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-96 bg-surface-200 rounded-xl animate-pulse" />
          <div className="h-96 bg-surface-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadAnalytics}
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
          <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
          <p className="text-surface-600">
            Track performance metrics and identify optimization opportunities
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center bg-surface-100 rounded-lg p-1">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' }
          ].map(period => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === period.value 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              {period.label}
            </button>
          ))}
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
            title="Total Orders"
            value={analytics?.totalOrders?.toLocaleString() || 0}
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
            title="Total Revenue"
            value={`$${(analytics?.totalRevenue || 0).toLocaleString()}`}
            change="+18.3%"
            trend="up"
            icon="DollarSign"
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
            title="Customer Rating"
            value={`${analytics?.customerSatisfaction || 0}/5`}
            change="+0.2"
            trend="up"
            icon="Star"
            color="warning"
          />
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Delivery Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Delivery Trends</h3>
              <ApperIcon name="TrendingUp" className="text-surface-400" />
            </div>
            {deliveryStats ? (
              <Chart
                options={deliveryChartOptions}
                series={deliveryChartSeries}
                type="line"
                height={350}
              />
            ) : (
              <div className="h-80 bg-surface-50 rounded-lg animate-pulse" />
            )}
          </Card>
        </motion.div>

        {/* Driver Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Driver Performance</h3>
              <ApperIcon name="Users" className="text-surface-400" />
            </div>
            {driverPerformance.length > 0 ? (
              <Chart
                options={performanceChartOptions}
                series={performanceChartSeries}
                type="bar"
                height={350}
              />
            ) : (
              <div className="h-80 bg-surface-50 rounded-lg animate-pulse" />
            )}
          </Card>
        </motion.div>
      </div>

      {/* Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Driver Leaderboard</h3>
            <Badge variant="primary" icon="Trophy">
              Top Performers
            </Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 text-left">
                  <th className="pb-3 text-sm font-semibold text-surface-700">Driver</th>
                  <th className="pb-3 text-sm font-semibold text-surface-700">Deliveries</th>
                  <th className="pb-3 text-sm font-semibold text-surface-700">On-Time Rate</th>
                  <th className="pb-3 text-sm font-semibold text-surface-700">Rating</th>
                  <th className="pb-3 text-sm font-semibold text-surface-700">Earnings</th>
                  <th className="pb-3 text-sm font-semibold text-surface-700">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {driverPerformance
                  .sort((a, b) => b.efficiency - a.efficiency)
                  .map((driver, index) => (
                    <motion.tr
                      key={driver.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + (index * 0.1) }}
                      className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                    >
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          {index < 3 && (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                              ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-surface-400' : 'bg-orange-600'}
                            `}>
                              {index + 1}
                            </div>
                          )}
                          <span className="font-medium text-surface-900">{driver.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-surface-700">{driver.deliveries}</td>
                      <td className="py-3">
                        <span className={`font-medium ${
                          driver.onTimeRate >= 95 ? 'text-accent' : 
                          driver.onTimeRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {driver.onTimeRate}%
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <ApperIcon name="Star" size={14} className="text-yellow-500 mr-1" />
                          <span className="font-medium">{driver.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 font-medium text-surface-900">
                        ${driver.earnings.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-surface-200 rounded-full h-2 max-w-20">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${driver.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-surface-700">
                            {driver.efficiency}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;