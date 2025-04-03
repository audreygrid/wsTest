import WebSocket from 'ws';
import http from 'http';

// Use the provided PORT or default to 8080
const PORT = process.env.PORT || 8080;

// Create an HTTP server (Render requires an HTTP listener)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server is running!\n');
});

// Attach WebSocket server to HTTP server
const wss = new WebSocket.Server({ server });

console.log(`WebSocket server running on port ${PORT}`);

wss.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Broadcast to all clients except sender
        wss.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
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
