import Dashboard from '@/components/pages/Dashboard';
import Orders from '@/components/pages/Orders';
import Fleet from '@/components/pages/Fleet';
import Routes from '@/components/pages/Routes';
import Analytics from '@/components/pages/Analytics';
import Booking from '@/components/pages/Booking';
import Tracking from '@/components/pages/Tracking';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'Package',
    component: Orders
  },
  fleet: {
    id: 'fleet',
    label: 'Fleet',
    path: '/fleet',
    icon: 'Truck',
    component: Fleet
  },
  routes: {
    id: 'routes',
    label: 'Routes',
    path: '/routes',
    icon: 'Route',
    component: Routes
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: Analytics
  },
  booking: {
    id: 'booking',
    label: 'Book Delivery',
    path: '/booking',
    icon: 'Plus',
    component: Booking
  },
  tracking: {
    id: 'tracking',
    label: 'Track Package',
    path: '/tracking',
    icon: 'MapPin',
    component: Tracking
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
  routes: {
    id: 'routes',
    label: 'Routes',
    path: '/routes',
    icon: 'Route',
    component: Routes
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: Analytics
  },
  booking: {
    id: 'booking',
    label: 'Book Delivery',
    path: '/booking',
    icon: 'Plus',
    component: Booking
  },
  tracking: {
    id: 'tracking',
    label: 'Track Package',
    path: '/tracking',
    icon: 'MapPin',
    component: Tracking
  }
};

export const routeArray = Object.values(routes);
export default routes;