import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { taskService, driverService } from '@/services';
import { format } from 'date-fns';

const Routes = () => {
  const [tasks, setTasks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('all');

  useEffect(() => {
    loadRoutesData();
  }, []);

  const loadRoutesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, driversData] = await Promise.all([
        taskService.getAll(),
        driverService.getAll()
      ]);
      
      setTasks(tasksData);
      setDrivers(driversData);
    } catch (err) {
      setError(err.message || 'Failed to load routes data');
      toast.error('Failed to load routes data');
    } finally {
      setLoading(false);
    }
  };

  const getTaskIcon = (type) => {
    return type === 'pickup' ? 'Package' : 'MapPin';
  };

  const getTaskColor = (type) => {
    return type === 'pickup' ? 'primary' : 'accent';
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'warning',
      in_progress: 'info',
      completed: 'success',
      failed: 'error'
    };
    return colors[status] || 'default';
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const filteredTasks = selectedDriver === 'all' 
    ? tasks 
    : tasks.filter(task => task.driverId === selectedDriver);

  const groupTasksByDriver = () => {
    const grouped = {};
    filteredTasks.forEach(task => {
      const driverName = getDriverName(task.driverId);
      if (!grouped[driverName]) {
        grouped[driverName] = [];
      }
      grouped[driverName].push(task);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-surface-900">Route Management</h1>
        </div>
        <SkeletonLoader count={5} type="row" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Route Management</h1>
        </div>
        <ErrorState 
          message={error}
          onRetry={loadRoutesData}
        />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Route Management</h1>
        </div>
        <EmptyState
          icon="Route"
          title="No routes found"
          description="Routes will appear here when orders are assigned to drivers"
          actionLabel="View Orders"
          onAction={() => window.location.href = '/orders'}
        />
      </div>
    );
  }

  const groupedTasks = groupTasksByDriver();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Route Management</h1>
          <p className="text-surface-600">
            Track and optimize delivery routes for maximum efficiency
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Driver Filter */}
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="all">All Drivers</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
          
          <Button variant="primary" icon="Route">
            Optimize Routes
          </Button>
        </div>
      </div>

      {/* Route Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {tasks.filter(t => t.status === 'assigned').length}
          </div>
          <div className="text-sm text-surface-600">Assigned</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {tasks.filter(t => t.status === 'in_progress').length}
          </div>
          <div className="text-sm text-surface-600">In Progress</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-accent mb-1">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
          <div className="text-sm text-surface-600">Completed</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-surface-900 mb-1">
            {Object.keys(groupedTasks).length}
          </div>
          <div className="text-sm text-surface-600">Active Routes</div>
        </Card>
      </div>

      {/* Routes by Driver */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([driverName, driverTasks], driverIndex) => (
          <motion.div
            key={driverName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: driverIndex * 0.1 }}
          >
            <Card>
              {/* Driver Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-surface-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900">{driverName}</h3>
                    <p className="text-sm text-surface-600">
                      {driverTasks.length} tasks • {driverTasks.filter(t => t.status === 'completed').length} completed
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" icon="MessageCircle">
                    Message
                  </Button>
                  <Button variant="outline" size="sm" icon="Navigation">
                    Track
                  </Button>
                </div>
              </div>

              {/* Tasks Timeline */}
              <div className="space-y-4">
                {driverTasks
                  .sort((a, b) => new Date(a.timeWindow?.start || 0) - new Date(b.timeWindow?.start || 0))
                  .map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (driverIndex * 0.1) + (taskIndex * 0.05) }}
                      className="flex items-start space-x-4"
                    >
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${task.status === 'completed' 
                            ? 'bg-accent text-white' 
                            : task.status === 'in_progress'
                              ? 'bg-blue-500 text-white'
                              : 'bg-surface-200 text-surface-600'
                          }
                        `}>
                          <ApperIcon name={getTaskIcon(task.type)} size={16} />
                        </div>
                        {taskIndex < driverTasks.length - 1 && (
                          <div className="w-0.5 h-12 bg-surface-200 mt-2" />
                        )}
                      </div>

                      {/* Task details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant={getTaskColor(task.type)} size="xs">
                                {task.type.toUpperCase()}
                              </Badge>
                              <Badge variant={getStatusColor(task.status)} size="xs">
                                {task.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            
                            <p className="text-sm font-medium text-surface-900 mb-1 break-words">
                              {task.location?.address}
                            </p>
                            
                            <div className="text-xs text-surface-600 space-y-1">
                              {task.timeWindow && (
                                <div className="flex items-center">
                                  <ApperIcon name="Clock" size={12} className="mr-1" />
                                  <span>
                                    {format(new Date(task.timeWindow.start), 'HH:mm')} - 
                                    {format(new Date(task.timeWindow.end), 'HH:mm')}
                                  </span>
                                </div>
                              )}
                              
                              {task.estimatedDuration && (
                                <div className="flex items-center">
                                  <ApperIcon name="Timer" size={12} className="mr-1" />
                                  <span>{task.estimatedDuration} min estimated</span>
                                </div>
                              )}
                              
                              {task.completedAt && (
                                <div className="flex items-center text-accent">
                                  <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                                  <span>Completed at {format(new Date(task.completedAt), 'HH:mm')}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {task.status === 'assigned' && (
                            <Button variant="outline" size="sm" icon="Play">
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Routes;