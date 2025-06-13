import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { settingsService } from '@/services';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notificationData, addressData] = await Promise.all([
        settingsService.getNotificationPreferences(),
        settingsService.getSavedAddresses()
      ]);
      setNotifications(notificationData);
      setAddresses(addressData);
    } catch (err) {
      setError('Failed to load settings');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveNotifications = async () => {
    try {
      setSaving(true);
      await settingsService.updateNotificationPreferences(notifications);
      toast.success('Notification preferences saved successfully');
    } catch (err) {
      toast.error('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingAddress) {
        await settingsService.updateAddress(editingAddress.id, addressForm);
        toast.success('Address updated successfully');
      } else {
        await settingsService.createAddress(addressForm);
        toast.success('Address added successfully');
      }
      await loadSettings();
      resetAddressForm();
    } catch (err) {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await settingsService.deleteAddress(id);
      toast.success('Address deleted successfully');
      await loadSettings();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const editAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
    setAddressForm({
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    });
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'addresses', label: 'Saved Addresses', icon: 'MapPin' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load settings"
          message={error}
          onRetry={loadSettings}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
          <p className="text-surface-600 mt-1">Manage your preferences and account settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'notifications' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="font-medium text-surface-900 mb-3">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-700">Order Updates</span>
                    <input
                      type="checkbox"
                      checked={notifications.email?.orderUpdates || false}
                      onChange={(e) => handleNotificationChange('email', {
                        ...notifications.email,
                        orderUpdates: e.target.checked
                      })}
                      className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-700">Promotions</span>
                    <input
                      type="checkbox"
                      checked={notifications.email?.promotions || false}
                      onChange={(e) => handleNotificationChange('email', {
                        ...notifications.email,
                        promotions: e.target.checked
                      })}
                      className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-700">Weekly Summary</span>
                    <input
                      type="checkbox"
                      checked={notifications.email?.weeklySummary || false}
                      onChange={(e) => handleNotificationChange('email', {
                        ...notifications.email,
                        weeklySummary: e.target.checked
                      })}
                      className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <h4 className="font-medium text-surface-900 mb-3">SMS Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-700">Delivery Notifications</span>
                    <input
                      type="checkbox"
                      checked={notifications.sms?.deliveryNotifications || false}
                      onChange={(e) => handleNotificationChange('sms', {
                        ...notifications.sms,
                        deliveryNotifications: e.target.checked
                      })}
                      className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-700">Urgent Updates</span>
                    <input
                      type="checkbox"
                      checked={notifications.sms?.urgentUpdates || false}
                      onChange={(e) => handleNotificationChange('sms', {
                        ...notifications.sms,
                        urgentUpdates: e.target.checked
                      })}
                      className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h4 className="font-medium text-surface-900 mb-3">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-700">All Notifications</span>
                    <input
                      type="checkbox"
                      checked={notifications.push?.enabled || false}
                      onChange={(e) => handleNotificationChange('push', {
                        ...notifications.push,
                        enabled: e.target.checked
                      })}
                      className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={saveNotifications}
                  loading={saving}
                  className="px-6"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Saved Addresses</h3>
              <Button
                onClick={() => setShowAddressForm(true)}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Add Address</span>
              </Button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-surface-900">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAddressForm}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Label"
                      required
                    >
                      <Input
                        type="text"
                        value={addressForm.label}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Home, Work, etc."
                        required
                      />
                    </FormField>

                    <FormField
                      label="Street Address"
                      required
                    >
                      <Input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="123 Main St"
                        required
                      />
                    </FormField>

                    <FormField
                      label="City"
                      required
                    >
                      <Input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="New York"
                        required
                      />
                    </FormField>

                    <FormField
                      label="State"
                      required
                    >
                      <Input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="NY"
                        required
                      />
                    </FormField>

                    <FormField
                      label="ZIP Code"
                      required
                    >
                      <Input
                        type="text"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="10001"
                        required
                      />
                    </FormField>

                    <FormField
                      label="Country"
                      required
                    >
                      <Input
                        type="text"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="United States"
                        required
                      />
                    </FormField>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-4 h-4 text-primary focus:ring-primary border-surface-300 rounded"
                    />
                    <label htmlFor="isDefault" className="text-surface-700">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resetAddressForm}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={saving}
                    >
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Address List */}
            <div className="grid gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-surface-900">{address.label}</h4>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-surface-600 text-sm">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zipCode}<br />
                        {address.country}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editAddress(address)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {addresses.length === 0 && (
              <Card className="p-8 text-center">
                <ApperIcon name="MapPin" size={48} className="mx-auto text-surface-400 mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No saved addresses</h3>
                <p className="text-surface-600 mb-4">Add your first address to make booking faster</p>
                <Button onClick={() => setShowAddressForm(true)}>
                  Add Address
                </Button>
              </Card>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;