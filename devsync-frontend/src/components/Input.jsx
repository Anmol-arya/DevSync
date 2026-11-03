const Input = ({ label, type = "text", placeholder, value, onChange }) => {
  return (
    <div className="mb-4">
      {/* Label for the input */}
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {/* The actual input field */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // Tailwind: dark card bg, white text, yellow border on focus
        className="w-full px-4 py-2 bg-brand-card text-white border border-gray-600 rounded focus:outline-none focus:border-brand-yellow transition"
      />
    </div>
  );
};

export default Input;

