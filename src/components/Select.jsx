export default function Select({
  label,
  id,
  options,
  placeholder = 'Selecciona una opción',
  required = false,
  error,
  ...props
}) {
  return (
    <div className="mb-7">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        required={required}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          ${error
            ? 'border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-500/20'
            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500/20 dark:focus:border-blue-400'
          }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">{error}</p>}
    </div>
  );
}
