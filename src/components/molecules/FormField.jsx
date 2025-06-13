import Input from '@/components/atoms/Input';

const FormField = ({ 
  label, 
  error, 
  required = false, 
  className = '', 
  children,
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {React.isValidElement(children) ? 
        React.cloneElement(children, { label, error, required, ...props }) :
        <Input label={label} error={error} required={required} {...props} />
      }
    </div>
  );
};

export default FormField;