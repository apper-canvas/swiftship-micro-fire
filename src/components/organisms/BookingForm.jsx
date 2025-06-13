import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { orderService } from '@/services';

const BookingForm = ({ onComplete, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [priceQuote, setPriceQuote] = useState(null);
  
  const [formData, setFormData] = useState({
    // Customer info
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    
    // Pickup details
    pickupAddress: {
      street: '',
      city: 'San Francisco',
      state: 'CA',
      zipCode: ''
    },
    pickupNotes: '',
    
    // Delivery details
    deliveryAddress: {
      street: '',
      city: 'San Francisco', 
      state: 'CA',
      zipCode: ''
    },
    deliveryNotes: '',
    
    // Package details
    packageDetails: {
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      type: 'general',
      value: '',
      urgent: false,
      fragile: false
    }
  });
  
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Customer Info', icon: 'User' },
    { id: 2, title: 'Pickup & Delivery', icon: 'MapPin' },
    { id: 3, title: 'Package Details', icon: 'Package' },
    { id: 4, title: 'Review & Confirm', icon: 'CheckCircle' }
  ];

  const packageTypes = [
    { value: 'general', label: 'General Package' },
    { value: 'documents', label: 'Documents' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'books', label: 'Books & Media' }
  ];

  const updateFormData = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.customerName) newErrors.customerName = 'Name is required';
        if (!formData.customerPhone) newErrors.customerPhone = 'Phone is required';
        break;
      case 2:
        if (!formData.pickupAddress.street) newErrors.pickupStreet = 'Pickup address is required';
        if (!formData.deliveryAddress.street) newErrors.deliveryStreet = 'Delivery address is required';
        break;
      case 3:
        if (!formData.packageDetails.weight) newErrors.weight = 'Weight is required';
        if (!formData.packageDetails.type) newErrors.type = 'Package type is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePrice = async () => {
    setLoading(true);
    try {
      const quote = await orderService.calculatePrice(
        formData.pickupAddress,
        formData.deliveryAddress,
        {
          ...formData.packageDetails,
          weight: parseFloat(formData.packageDetails.weight)
        }
      );
      setPriceQuote(quote);
    } catch (error) {
      toast.error('Failed to calculate price');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep === 3) {
      await calculatePrice();
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const order = await orderService.create({
        ...formData,
        packageDetails: {
          ...formData.packageDetails,
          weight: parseFloat(formData.packageDetails.weight),
          value: parseFloat(formData.packageDetails.value) || 0
        },
        price: priceQuote?.total || 0
      });
      
      toast.success('Order created successfully!');
      onComplete?.(order);
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <Input
              label="Full Name"
              value={formData.customerName}
              onChange={(e) => updateFormData(null, 'customerName', e.target.value)}
              error={errors.customerName}
              required
              icon="User"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => updateFormData(null, 'customerPhone', e.target.value)}
              error={errors.customerPhone}
              required
              icon="Phone"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => updateFormData(null, 'customerEmail', e.target.value)}
              icon="Mail"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ApperIcon name="MapPin" className="mr-2 text-primary" />
                Pickup Location
              </h3>
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  value={formData.pickupAddress.street}
                  onChange={(e) => updateFormData('pickupAddress', 'street', e.target.value)}
                  error={errors.pickupStreet}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={formData.pickupAddress.city}
                    onChange={(e) => updateFormData('pickupAddress', 'city', e.target.value)}
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.pickupAddress.zipCode}
                    onChange={(e) => updateFormData('pickupAddress', 'zipCode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ApperIcon name="Target" className="mr-2 text-accent" />
                Delivery Location
              </h3>
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  value={formData.deliveryAddress.street}
                  onChange={(e) => updateFormData('deliveryAddress', 'street', e.target.value)}
                  error={errors.deliveryStreet}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={formData.deliveryAddress.city}
                    onChange={(e) => updateFormData('deliveryAddress', 'city', e.target.value)}
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.deliveryAddress.zipCode}
                    onChange={(e) => updateFormData('deliveryAddress', 'zipCode', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Package Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                value={formData.packageDetails.weight}
                onChange={(e) => updateFormData('packageDetails', 'weight', e.target.value)}
                error={errors.weight}
                required
                icon="Weight"
              />
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Package Type *
                </label>
                <select
                  value={formData.packageDetails.type}
                  onChange={(e) => updateFormData('packageDetails', 'type', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg focus:border-primary focus:outline-none"
                >
                  {packageTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Package Value ($)"
              type="number"
              step="0.01"
              value={formData.packageDetails.value}
              onChange={(e) => updateFormData('packageDetails', 'value', e.target.value)}
              icon="DollarSign"
            />

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.packageDetails.fragile}
                  onChange={(e) => updateFormData('packageDetails', 'fragile', e.target.checked)}
                  className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-surface-700">Fragile Item</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.packageDetails.urgent}
                  onChange={(e) => updateFormData('packageDetails', 'urgent', e.target.checked)}
                  className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-surface-700">Urgent Delivery</span>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
            
            {/* Price Quote */}
            {priceQuote && (
              <Card className="bg-primary/5">
                <div className="space-y-3">
                  <h4 className="font-semibold text-surface-900">Price Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>${priceQuote.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight Fee:</span>
                      <span>${priceQuote.weightFee.toFixed(2)}</span>
                    </div>
                    {priceQuote.urgencyFee > 0 && (
                      <div className="flex justify-between">
                        <span>Urgency Fee:</span>
                        <span>${priceQuote.urgencyFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${priceQuote.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-surface-600">
                    Estimated Time: {priceQuote.estimatedTime}
                  </div>
                </div>
              </Card>
            )}

            {/* Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Customer</h4>
                <div className="space-y-1 text-sm text-surface-600">
                  <p>{formData.customerName}</p>
                  <p>{formData.customerPhone}</p>
                  {formData.customerEmail && <p>{formData.customerEmail}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Package</h4>
                <div className="space-y-1 text-sm text-surface-600">
                  <p>{formData.packageDetails.weight}kg</p>
                  <p>{packageTypes.find(t => t.value === formData.packageDetails.type)?.label}</p>
                  {formData.packageDetails.fragile && <p>Fragile</p>}
                  {formData.packageDetails.urgent && <p>Urgent</p>}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full
              ${currentStep >= step.id 
                ? 'bg-primary text-white' 
                : 'bg-surface-200 text-surface-600'
              }
            `}>
              <ApperIcon name={step.icon} size={16} />
            </div>
            <div className="ml-3 hidden sm:block">
              <p className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-primary' : 'text-surface-600'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                currentStep > step.id ? 'bg-primary' : 'bg-surface-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-surface-200">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {currentStep < steps.length ? (
            <Button
              variant="primary"
              onClick={handleNext}
              loading={loading}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              icon="CheckCircle"
            >
              Confirm Order
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingForm;