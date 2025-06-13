// Mock data imports
import notificationPreferences from '@/services/mockData/notificationPreferences.json';
import savedAddresses from '@/services/mockData/savedAddresses.json';

// In-memory storage for mock data
let preferences = [...notificationPreferences];
let addresses = [...savedAddresses];

// Utility function to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Notification Preferences Service
export const getNotificationPreferences = async () => {
  await delay();
  return { ...preferences[0] };
};

export const updateNotificationPreferences = async (data) => {
  await delay();
  preferences[0] = { ...preferences[0], ...data };
  return { ...preferences[0] };
};

// Saved Addresses Service
export const getSavedAddresses = async () => {
  await delay();
  return [...addresses];
};

export const getAddressById = async (id) => {
  await delay();
  const address = addresses.find(addr => addr.id === id);
  if (!address) {
    throw new Error('Address not found');
  }
  return { ...address };
};

export const createAddress = async (addressData) => {
  await delay();
  const newAddress = {
    id: Date.now(),
    ...addressData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // If this is set as default, remove default from others
  if (newAddress.isDefault) {
    addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
  }
  
  addresses.push(newAddress);
  return { ...newAddress };
};

export const updateAddress = async (id, addressData) => {
  await delay();
  const index = addresses.findIndex(addr => addr.id === id);
  if (index === -1) {
    throw new Error('Address not found');
  }
  
  // If this is set as default, remove default from others
  if (addressData.isDefault) {
    addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
  }
  
  addresses[index] = {
    ...addresses[index],
    ...addressData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...addresses[index] };
};

export const deleteAddress = async (id) => {
  await delay();
  const index = addresses.findIndex(addr => addr.id === id);
  if (index === -1) {
    throw new Error('Address not found');
  }
  
  addresses.splice(index, 1);
  return { success: true };
};

// Default export with all methods
const settingsService = {
  getNotificationPreferences,
  updateNotificationPreferences,
  getSavedAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
};

export default settingsService;