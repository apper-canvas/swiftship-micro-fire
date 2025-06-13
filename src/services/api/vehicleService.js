import vehiclesData from '../mockData/vehicles.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let vehicles = [...vehiclesData];

const vehicleService = {
  async getAll() {
    await delay(300);
    return [...vehicles];
  },

  async getById(id) {
    await delay(200);
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) throw new Error('Vehicle not found');
    return { ...vehicle };
  },

  async create(vehicleData) {
    await delay(400);
    const newVehicle = {
      ...vehicleData,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    vehicles.push(newVehicle);
    return { ...newVehicle };
  },

  async update(id, updates) {
    await delay(300);
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    
    vehicles[index] = { ...vehicles[index], ...updates };
    return { ...vehicles[index] };
  },

  async delete(id) {
    await delay(250);
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    
    vehicles.splice(index, 1);
    return { success: true };
  }
};

export default vehicleService;