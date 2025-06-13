import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card', className = '' }) => {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-xl border border-surface-200 p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <motion.div 
              className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-32"
              {...shimmer}
              style={{ backgroundSize: '200% 100%' }}
            />
            <motion.div 
              className="h-3 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-24"
              {...shimmer}
              style={{ backgroundSize: '200% 100%' }}
            />
          </div>
          <div className="h-6 bg-surface-200 rounded-full w-20" />
        </div>
        
        <div className="space-y-3">
          <motion.div 
            className="h-3 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-full"
            {...shimmer}
            style={{ backgroundSize: '200% 100%' }}
          />
          <motion.div 
            className="h-3 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4"
            {...shimmer}
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
        
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-surface-200 rounded w-full" />
          <div className="h-8 bg-surface-200 rounded w-full" />
        </div>
      </div>
    </div>
  );

  const SkeletonRow = () => (
    <div className="animate-pulse flex items-center space-x-4 p-4 bg-white rounded-lg border border-surface-200">
      <div className="w-10 h-10 bg-surface-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <motion.div 
          className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/2"
          {...shimmer}
          style={{ backgroundSize: '200% 100%' }}
        />
        <motion.div 
          className="h-3 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/3"
          {...shimmer}
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>
      <div className="h-6 bg-surface-200 rounded-full w-16" />
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard />;
      case 'row':
        return <SkeletonRow />;
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;