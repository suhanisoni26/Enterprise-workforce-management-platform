import { HiOutlineRefresh } from 'react-icons/hi';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...rest
}) => {
  const variantClass = variant === 'secondary' || variant === 'ghost' ? 'btn-secondary' : 'btn-primary';
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 ${variantClass} ${sizeClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...rest}
    >
      {loading ? (
        <HiOutlineRefresh className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
};

export default Button;
