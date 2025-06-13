import analyticsData from '../mockData/analytics.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const analyticsService = {
  async getOverview() {
    await delay(400);
    return { ...analyticsData.overview };
  },

  async getDeliveryStats(period = '7d') {
    await delay(300);
    return { ...analyticsData.deliveryStats[period] };
  },

  async getDriverPerformance() {
    await delay(350);
    return [...analyticsData.driverPerformance];
  },

  async getRevenueStats(period = '30d') {
    await delay(300);
    return { ...analyticsData.revenueStats[period] };
  },

  async getRouteEfficiency() {
    await delay(400);
    return { ...analyticsData.routeEfficiency };
  }
};

export default analyticsService;