import Button from "../components/Button.jsx";


const Window = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Window</h1>
      <p className="mb-4">This is the Window page.</p>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );
}
export default Window;