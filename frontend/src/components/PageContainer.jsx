export default function PageContainer({ children, className = "" }) {
  return (
    <div className={`max-w-xl mx-auto mt-12 p-8 bg-white rounded-3xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}