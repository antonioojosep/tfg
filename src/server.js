import http from 'http';
import app from './app.js';
import { setupSocket } from './sockets/socket.js';  // Corregir la ruta de importación
import { connectDB } from './config/db.js';

const init = async () => {
    try {
        // Conectar a MongoDB
        await connectDB();
        
        // Crear servidor HTTP
        const server = http.createServer(app);
        
        // Configurar Socket.IO
        setupSocket(server);

        // Iniciar servidor
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server initialization error:', error);
        process.exit(1);
    }
};

init();