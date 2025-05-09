import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';

const Window = () => {
  // Estado
  const [commands, setCommands] = useState([]);
  const [activeTab, setActiveTab] = useState('food');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Efectos
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const fetchCommands = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          credentials: 'include'
        });
        const data = await response.json();
        setCommands(data.filter(command => command.status === 'pending'));
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    };

    fetchCommands();
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Socket connection para actualizaciones en tiempo real
  useSocket((command) => {
    setCommands(prev => [...prev, command]);
  });

  // Handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error al intentar mostrar pantalla completa: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleCompleteCommand = async (commandId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${commandId}/complete`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCommands(prev => prev.filter(cmd => cmd._id !== commandId));
    } catch (error) {
      console.error('Error completing command:', error);
    }
  };

  // Helpers
  const getFilteredCommands = () => {
    return commands
      .map(command => ({
        ...command,
        products: command.products.filter(item => item.product.type === activeTab)
      }))
      .filter(command => command.products.length > 0);
  };



  return (
    <>
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Comandas en Preparación</h1>
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          >
            {isFullscreen ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9L4 4m0 0l5 5m-5-5v6m16-6l-5 5m5-5v6m-16 6l5-5m-5 5h6m10-5l-5 5m5-5v6m-16 0h6" />
                </svg>
                Salir de pantalla completa
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0-4l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Pantalla completa
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 mb-6">
          <button
            onClick={() => setActiveTab('food')}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
              ${activeTab === 'food' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
              }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Cocina
            </div>
          </button>
          <button
            onClick={() => setActiveTab('drink')}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
              ${activeTab === 'drink'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
              }`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5M5 12h14"/>
              </svg>
              Barra
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredCommands().map((command) => (
            <div 
              key={command._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Mesa {command.table.number}
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(command.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  #{command._id.slice(-4)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {command.products.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900">
                        {item.amount}x
                      </span>
                      <span className="ml-2 text-gray-800">
                        {item.product.name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === 'food' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activeTab === 'food' ? 'Cocina' : 'Barra'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCompleteCommand(command._id)}
                className={`w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all flex items-center justify-center text-white
                  ${activeTab === 'food' 
                    ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Marcar como completado
              </button>
            </div>
          ))}
        </div>

        {getFilteredCommands().length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No hay {activeTab === 'food' ? 'comidas' : 'bebidas'} pendientes
            </h3>
            <p className="mt-1 text-gray-500">
              Las nuevas comandas aparecerán aquí automáticamente.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Window;