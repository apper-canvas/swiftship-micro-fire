import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({
  message = 'Something went wrong',
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">Oops!</h3>
      <p className="text-surface-600 mb-6 max-w-md mx-auto">{message}</p>
      
      {onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" onClick={onRetry} icon="RotateCcw">
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;