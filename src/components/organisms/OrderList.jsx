import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCard from '@/components/molecules/OrderCard';
import SearchBar from '@/components/molecules/SearchBar';
import EmptyState from '@/components/organisms/EmptyState';
import { useNavigate } from 'react-router-dom';

const OrderList = ({ orders = [], loading = false, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleTrack = (order) => {
    navigate(`/tracking?id=${order.trackingNumber}`);
  };

  if (!loading && orders.length === 0) {
    return (
      <EmptyState
        icon="Package"
        title="No orders found"
        description="Orders will appear here once customers start booking deliveries"
        actionLabel="Create Test Order"
        onAction={() => navigate('/booking')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Search by tracking number or customer name..."
        onSearch={setSearchTerm}
        showFilters={true}
      />

      <AnimatePresence mode="popLayout">
        {filteredOrders.length === 0 && searchTerm ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              icon="Search"
              title="No orders match your search"
              description="Try adjusting your search terms or filters"
              actionLabel="Clear Search"
              onAction={() => setSearchTerm('')}
            />
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid gap-4"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <OrderCard
                  order={order}
                  onViewDetails={handleViewDetails}
                  onTrack={handleTrack}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderList;