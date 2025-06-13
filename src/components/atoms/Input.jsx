import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloatLabel = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      {/* Input container */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} size={20} />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-11' : ''} 
            border-2 rounded-lg bg-white
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-0
            ${error 
              ? 'border-red-500 focus:border-red-600' 
              : focused 
                ? 'border-primary focus:border-primary' 
                : 'border-surface-300 hover:border-surface-400'
            }
            ${disabled ? 'bg-surface-50 text-surface-500 cursor-not-allowed' : 'text-surface-900'}
            placeholder-transparent
          `}
          placeholder={placeholder}
          {...props}
        />

        {/* Floating label */}
        {label && (
          <motion.label
            initial={false}
            animate={{
              top: shouldFloatLabel ? '0.25rem' : '50%',
              left: icon ? '2.75rem' : '1rem',
              fontSize: shouldFloatLabel ? '0.75rem' : '1rem',
              translateY: shouldFloatLabel ? '0%' : '-50%',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              absolute pointer-events-none font-medium
              transition-colors duration-200
              ${error 
                ? 'text-red-500' 
                : focused 
                  ? 'text-primary' 
                  : shouldFloatLabel 
                    ? 'text-surface-600' 
                    : 'text-surface-500'
              }
              ${shouldFloatLabel ? 'bg-white px-1' : ''}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600 flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;