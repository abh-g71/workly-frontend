function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-dark-border text-txt-secondary',
    orange: 'bg-orange-bg text-orange-primary border border-orange-border',
    green: 'bg-green-500/10 text-green-400 border border-green-500/30',
    yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    red: 'bg-red-500/10 text-red-400 border border-red-500/30',
    gray: 'bg-dark-border text-txt-secondary',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
