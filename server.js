import { WebSocketServer } from 'ws'; // Use WebSocketServer instead of WebSocket
import http from 'http';

const PORT = process.env.PORT || 8080;

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server is running!\n');
});

// Create WebSocket server using WebSocketServer class
const wss = new WebSocketServer({ server });

console.log(`WebSocket server running on port ${PORT}`);

wss.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== socket && client.readyState === socket.OPEN) {
                client.send(`Echo: ${message}`);
            }
        });
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the HTTP server
server.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});
