import ordersData from '../mockData/orders.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let orders = [...ordersData];

const orderService = {
  async getAll() {
    await delay(300);
    return [...orders];
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return { ...order };
  },

  async create(orderData) {
    await delay(400);
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  async update(id, updates) {
    await delay(300);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    orders[index] = { ...orders[index], ...updates };
    return { ...orders[index] };
  },

  async delete(id) {
    await delay(250);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    orders.splice(index, 1);
    return { success: true };
  },

  async getByStatus(status) {
    await delay(200);
    return orders.filter(o => o.status === status);
  },

  async calculatePrice(pickupAddress, deliveryAddress, packageDetails) {
    await delay(500);
    // Simple distance-based pricing calculation
    const basePrice = 8.50;
    const weightMultiplier = packageDetails.weight * 0.5;
    const urgencyMultiplier = packageDetails.urgent ? 3.5 : 1;
    
    return {
      basePrice,
      weightFee: weightMultiplier,
      urgencyFee: packageDetails.urgent ? basePrice * 0.4 : 0,
      total: (basePrice + weightMultiplier) * urgencyMultiplier,
      estimatedTime: packageDetails.urgent ? '1-2 hours' : '3-6 hours'
    };
  }
};

export default orderService;