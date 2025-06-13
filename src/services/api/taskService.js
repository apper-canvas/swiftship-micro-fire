import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      status: 'assigned',
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], ...updates };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks.splice(index, 1);
    return { success: true };
  },

  async getByDriver(driverId) {
    await delay(200);
    return tasks.filter(t => t.driverId === driverId);
  },

  async completeTask(id, proofOfDelivery) {
    await delay(400);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = {
      ...tasks[index],
      status: 'completed',
      completedAt: new Date().toISOString(),
      proofOfDelivery
    };
    return { ...tasks[index] };
  }
};

export default taskService;