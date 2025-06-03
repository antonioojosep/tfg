import { useState, use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTables from "../hooks/useTables";
import useSocket from "../hooks/useSocket";
import Card from "../components/Card";
import Loader from "../components/Loader";
import PageContainer from "../components/PageContainer";
import ProductBrowser from "./ProductBrowser";
import AuthContext from "../context/Authcontext.jsx";

const getStatusBadgeClasses = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'completed':
      return 'Completado';
    case 'paid':
      return 'Pagado';
    default:
      return status;
  }
};

export default function TableSelector() {
  const { tables, loading, refreshTables } = useTables();
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState(null);
  const [order, setOrder] = useState([]);
  const [currentCommands, setCurrentCommands] = useState([]);
  const { handleLogout, company } = use(AuthContext);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Suscripción a eventos de WebSocket
  useSocket((event) => {
    if (!event) return;
    
    console.log('WebSocket event received:', event); // Para debugging

    switch (event.type) {
      case 'new-command':
        if (selectedTable && event.command.table._id === selectedTable._id) {
          setCurrentCommands(prev => [...prev, event.command]);
          refreshTables();
        }
        break;

      case 'command-completed':
        if (selectedTable) {
          setCurrentCommands(prev => 
            prev.map(command => 
              command._id === event.command._id
                ? { ...command, status: 'completed' }
                : command
            )
          );
        }
        break;

      case 'bill-paid':
        if (selectedTable && event.bill.table === selectedTable._id) {
          setCurrentCommands([]);
          setOrder([]);
          setSelectedTable(null);
        }
        refreshTables();
        break;

      case 'table-updated':
        refreshTables();
        if (selectedTable && event.tableId === selectedTable._id) {
          setSelectedTable(prev => ({
            ...prev,
            isAvailable: event.isAvailable
          }));
        }
        break;
    }
  });

  const fetchTableCommands = async (tableId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/table/all/${tableId}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      // Filtrar solo las que NO están pagadas
      setCurrentCommands(data.filter(cmd => cmd.status !== "paid"));
    } catch (error) {
      console.error('Error fetching table commands:', error);
    }
  };

  const handleAddProduct = (product) => {
    setOrder(prevOrder => {
      // Buscar si el producto ya existe en la orden
      const existingProductIndex = prevOrder.findIndex(item => 
        item.product._id === product._id
      );

      if (existingProductIndex !== -1) {
        // Si el producto existe, incrementar su cantidad
        const updatedOrder = [...prevOrder];
        updatedOrder[existingProductIndex] = {
          ...updatedOrder[existingProductIndex],
          amount: (updatedOrder[existingProductIndex].amount || 1) + 1
        };
        return updatedOrder;
      } else {
        // Si el producto no existe, añadirlo con cantidad 1
        return [...prevOrder, { product, amount: 1 }];
      }
    });
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    fetchTableCommands(table._id);
  };

  const handleSendOrder = async () => {
    try {
      const orderData = {
        table: selectedTable._id,
        products: order.map(item => ({
          product: item.product,
          amount: item.amount || 1,
        })),
        company: selectedTable.company
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error('Error al enviar la orden');
      }

      setCurrentCommands([]);
      setOrder([]);
      setSelectedTable(null);
    } catch (error) {
      console.error("Error al enviar la orden:", error);
    }
  };

  const handlePayTable = async (selectedMethod) => {
    try {
      if (!selectedTable?._id || !selectedTable?.company) {
        throw new Error('Información de mesa incompleta');
      }
      if (!currentCommands?.length) {
        throw new Error('No hay comandas para pagar');
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bills`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableId: selectedTable._id,
            method: selectedMethod,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Error al procesar el pago');
      }
      setCurrentCommands([]);
      setOrder([]);
      setSelectedTable(null);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <PageContainer>
      {selectedTable ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Mesa {selectedTable.number}
            </h1>
            <div className="space-x-4">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Pagar Mesa
                </div>
              </button>
              <button
                onClick={() => setSelectedTable(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Volver a las mesas
              </button>
            </div>
          </div>

          {currentCommands.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Total de la Mesa
                </h2>
                <span className="text-2xl font-bold text-gray-900">
                  {currentCommands.reduce((total, command) => {
                    return total + command.products.reduce((sum, item) => {
                      return sum + (item.product.price * item.amount);
                    }, 0);
                  }, 0).toFixed(2)}€
                </span>
              </div>
              <div className="space-y-4">
                {currentCommands.map((command) => (
                  <div 
                    key={command._id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-500">
                        {new Date(command.createdAt).toLocaleTimeString()}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClasses(command.status)}`}>
                        {getStatusText(command.status)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {command.products.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="font-medium">{item.amount}x</span>
                            <span className="ml-2">{item.product.name}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.product.type === 'food' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.product.type === 'food' ? 'Cocina' : 'Barra'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ProductBrowser 
            onAddProduct={handleAddProduct}
            order={order}
            onSendOrder={handleSendOrder}
            onRemoveProduct={(idx) => {
              setOrder(prev => prev.filter((_, i) => i !== idx));
            }}
          />
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Selecciona una mesa</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tables.map(table => (
              <Card
                key={table._id}
                className={`cursor-pointer transition text-center hover:shadow-xl`}
                onClick={() => handleTableSelect(table)}
              >
                <div className="text-xl font-semibold text-primary">
                  Mesa {table.number}
                </div>
                <div className={`text-sm mt-2 ${
                  table.isAvailable 
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {table.isAvailable ? 'Disponible' : 'Ocupada'}
                </div>
                {!table.isAvailable && (
                  <div className="text-xs text-gray-500 mt-1">
                    Ver comandas activas
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-4">Selecciona método de pago</h2>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full mb-6 p-2 border rounded-lg"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await handlePayTable(paymentMethod);
                  setShowPaymentModal(false);
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}