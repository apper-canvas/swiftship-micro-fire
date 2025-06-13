import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const StatusCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary',
  trend = 'up',
  className = '' 
}) => {
  const colors = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-600 bg-red-100'
  };

  const trendColors = {
    up: 'text-accent',
    down: 'text-red-500',
    neutral: 'text-surface-500'
  };

  const trendIcons = {
    up: 'TrendingUp',
    down: 'TrendingDown',
    neutral: 'Minus'
  };

  return (
    <Card hover className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <motion.p 
            className="text-2xl font-bold text-surface-900 mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${trendColors[trend]}`}>
              <ApperIcon name={trendIcons[trend]} size={14} className="mr-1" />
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatusCard;