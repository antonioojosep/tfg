export default function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}