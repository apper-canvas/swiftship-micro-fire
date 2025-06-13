import driversData from '../mockData/drivers.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let drivers = [...driversData];

const driverService = {
  async getAll() {
    await delay(300);
    return [...drivers];
  },

  async getById(id) {
    await delay(200);
    const driver = drivers.find(d => d.id === id);
    if (!driver) throw new Error('Driver not found');
    return { ...driver };
  },

  async create(driverData) {
    await delay(400);
    const newDriver = {
      ...driverData,
      id: Date.now().toString(),
      status: 'available',
      createdAt: new Date().toISOString(),
      totalDeliveries: 0,
      rating: 5.0
    };
    drivers.push(newDriver);
    return { ...newDriver };
  },

  async update(id, updates) {
    await delay(300);
    const index = drivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    
    drivers[index] = { ...drivers[index], ...updates };
    return { ...drivers[index] };
  },

  async delete(id) {
    await delay(250);
    const index = drivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    
    drivers.splice(index, 1);
    return { success: true };
  },

  async updateLocation(id, location) {
    await delay(150);
    const index = drivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    
    drivers[index] = {
      ...drivers[index],
      currentLocation: location,
      lastLocationUpdate: new Date().toISOString()
    };
    return { ...drivers[index] };
  },

  async getAvailable() {
    await delay(200);
    return drivers.filter(d => d.status === 'available');
  }
};

export default driverService;