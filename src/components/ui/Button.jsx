import Spinner from './Spinner';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-orange-primary text-white hover:bg-orange-hover rounded-md',
    secondary: 'bg-dark-card text-txt-primary border border-dark-border hover:border-orange-primary/50 rounded-md',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-md',
    success: 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 rounded-md',
    ghost: 'bg-transparent text-txt-secondary hover:text-white hover:bg-dark-card rounded-md',
    'orange-pill': 'bg-orange-primary text-white hover:bg-orange-hover rounded-full',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    full: 'w-full px-4 py-3 text-base gap-2',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

export default Button;
