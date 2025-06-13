// API Services
export { default as orderService } from '@/services/api/orderService';
export { default as driverService } from '@/services/api/driverService';
export { default as vehicleService } from '@/services/api/vehicleService';
export { default as taskService } from '@/services/api/taskService';
export { default as analyticsService } from '@/services/api/analyticsService';
export { default as settingsService } from '@/services/api/settingsService';

// Individual exports for destructuring
export {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '@/services/api/orderService';

export {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
} from '@/services/api/driverService';

export {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '@/services/api/vehicleService';

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '@/services/api/taskService';

export {
  getAnalytics,
  getPerformanceMetrics,
  getDeliveryStats
} from '@/services/api/analyticsService';

export {
  getNotificationPreferences,
  updateNotificationPreferences,
  getSavedAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
} from '@/services/api/settingsService';