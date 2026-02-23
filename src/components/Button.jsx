export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200';

  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark disabled:bg-gray-400 dark:disabled:bg-gray-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 dark:bg-red-700 dark:hover:bg-red-800',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-10 py-4 text-base',
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
}
