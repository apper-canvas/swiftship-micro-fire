import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'sm',
  hover = false,
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const CardComponent = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={`
        bg-white rounded-xl border border-surface-200
        ${paddings[padding]} ${shadows[shadow]}
        ${className}
      `}
      {...hoverProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;