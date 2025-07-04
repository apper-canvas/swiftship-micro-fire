import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({
  icon = 'Package',
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-4"
      >
        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} size={32} className="text-surface-400" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;