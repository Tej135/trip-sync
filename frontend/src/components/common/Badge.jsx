import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-brand-950/80 text-brand-300 border-brand-800/60',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    danger: 'bg-red-950/80 text-red-300 border-red-800/60',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
    gold: 'bg-yellow-950/80 text-yellow-300 border-yellow-700/60'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
