import { useState } from "react";
import PageContainer from "./components/PageContainer.jsx";
import Button from "./components/Button.jsx";
import UserSelect from "./pages/UserSelect.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import TableSelect from "./pages/TableSelector.jsx";
import ProductBrowser from "./pages/ProductBrowser.jsx";
import useSocket from "./hooks/useSocket.jsx";
import PrinterSelector from "./pages/PrinterSelector.jsx";

export default function App() {
  const [role, setRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [order, setOrder] = useState([]);

  useSocket();

  const handleAddProduct = (product) => setOrder((prev) => [...prev, product]);
  const handleRemoveProduct = (idx) => setOrder((prev) => prev.filter((_, i) => i !== idx));

  const handleSendOrder = async () => {
    if (!order.length) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: selectedTable._id,
        products: order.map((p) => ({ product: p._id, amount: 1 })),
      }),
    });
    if (res.ok) {
      const command = await res.json();
      setOrder([]);
      if (command.printFailed) {
        const pdfRes = await fetch(`${import.meta.env.VITE_API_URL}/api/printers/download-ticket/${command._id}`);
        if (pdfRes.ok) {
          const blob = await pdfRes.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `ticket_${command._id}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }
      }
    }
  };

  if (!role) {
    return (
      <PageContainer>
        {!selectedUser ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-primary">Select your user</h2>
            <UserSelect onSelect={setSelectedUser} />
          </>
        ) : (
          <UserLogin user={selectedUser} onLogin={setRole} onBack={() => setSelectedUser(null)} />
        )}
      </PageContainer>
    );
  }

  if (!selectedTable) {
    return (
      <PageContainer>
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Selecciona una mesa</h2>
        <TableSelect onSelect={setSelectedTable} />
        <Button onClick={() => { setRole(null); setSelectedUser(null); }}>Logout</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PrinterSelector />
      <div className="mb-4 text-center text-lg font-semibold text-primary">
        Mesa {selectedTable.number}
      </div>
      <ProductBrowser
        onAddProduct={handleAddProduct}
        order={order}
        onSendOrder={handleSendOrder}
        onRemoveProduct={handleRemoveProduct}
      />
      <Button onClick={() => { setSelectedTable(null); setOrder([]); }} className="w-full mt-6">
        Cambiar mesa
      </Button>
      <Button onClick={() => { setRole(null); setSelectedUser(null); setSelectedTable(null); setOrder([]); }} className="w-full mt-2">
        Logout
      </Button>
    </PageContainer>
  );
}