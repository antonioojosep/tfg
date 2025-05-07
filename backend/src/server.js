import http from "http";
import app from "./app.js";
import { connectDB } from './config/db.js';
import { setupSocket } from './sockets/socket.js';

const init = async () => {
    try {
        await connectDB();
        const server = http.createServer(app);

        setupSocket(server);

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