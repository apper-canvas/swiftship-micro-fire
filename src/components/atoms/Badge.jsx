import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  icon, 
  className = '',
  animate = false
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    // Status-specific variants
    pending: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    available: 'bg-green-100 text-green-800',
    busy: 'bg-orange-100 text-orange-800',
    offline: 'bg-surface-100 text-surface-800'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const BadgeComponent = animate ? motion.span : 'span';
  const animationProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <BadgeComponent
      className={`
        inline-flex items-center rounded-full font-medium
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...animationProps}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} 
          className="mr-1" 
        />
      )}
      {children}
    </BadgeComponent>
  );
};

export default Badge;