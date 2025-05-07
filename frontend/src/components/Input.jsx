export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`bg-white border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center ${className}`}
      {...props}
    />
  );
}