import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      action: () => {
        setIsOpen(false);
        // Navigate to profile when implemented
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      action: () => {
        setIsOpen(false);
        navigate('/settings');
      }
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => {
        setIsOpen(false);
        // Navigate to help when implemented
      }
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: 'LogOut',
      action: () => {
        setIsOpen(false);
        // Handle logout when implemented
      }
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-surface-300 rounded-full flex items-center justify-center hover:bg-surface-400 transition-colors"
      >
        <ApperIcon name="User" size={16} className="text-surface-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50"
          >
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full px-4 py-2 text-left flex items-center space-x-3 text-sm hover:bg-surface-50 transition-colors ${
                  index === menuItems.length - 1 ? 'border-t border-surface-100 mt-1 pt-3' : ''
                }`}
              >
                <ApperIcon name={item.icon} size={16} className="text-surface-500" />
                <span className="text-surface-700">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;