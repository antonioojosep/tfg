export default function Alert({ children, type = "info", className = "" }) {
  const color =
    type === "error"
      ? "bg-danger text-white"
      : type === "success"
      ? "bg-accent text-white"
      : "bg-primary-light text-primary-dark";
  return (
    <div className={`rounded-xl px-4 py-2 mb-2 ${color} ${className}`}>
      {children}
    </div>
  );
}