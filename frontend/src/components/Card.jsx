export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-surface rounded-3xl shadow-md p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}