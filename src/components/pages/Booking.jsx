import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BookingForm from '@/components/organisms/BookingForm';

const Booking = () => {
  const navigate = useNavigate();

  const handleBookingComplete = (order) => {
    // Redirect to tracking page with the new order
    navigate(`/tracking?id=${order.trackingNumber}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Book a Delivery</h1>
        <p className="text-surface-600 max-w-2xl mx-auto">
          Schedule your pickup and delivery with our AI-powered logistics platform. 
          Get instant quotes and real-time tracking for all your courier needs.
        </p>
      </div>

      {/* Booking Form */}
      <BookingForm onComplete={handleBookingComplete} />

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 grid md:grid-cols-3 gap-6"
      >
        <div className="text-center p-6 bg-surface-50 rounded-xl">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-lg">⚡</span>
          </div>
          <h3 className="font-semibold text-surface-900 mb-2">Instant Quotes</h3>
          <p className="text-sm text-surface-600">
            Get pricing in under 2 seconds with our AI-powered estimation engine
          </p>
        </div>
        
        <div className="text-center p-6 bg-surface-50 rounded-xl">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-accent font-bold text-lg">📍</span>
          </div>
          <h3 className="font-semibold text-surface-900 mb-2">Live Tracking</h3>
          <p className="text-sm text-surface-600">
            Track your package in real-time with GPS updates and delivery notifications
          </p>
        </div>
        
        <div className="text-center p-6 bg-surface-50 rounded-xl">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-secondary font-bold text-lg">🛡️</span>
          </div>
          <h3 className="font-semibold text-surface-900 mb-2">Secure & Reliable</h3>
          <p className="text-sm text-surface-600">
            End-to-end encryption and proof of delivery for complete peace of mind
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Booking;