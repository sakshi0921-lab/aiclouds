const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 5000; // Specify the port, allow environment variable

app.use(cors());

// API endpoint for dashboard metrics
app.get('/api/dashboard', (req, res) => {
  res.json({
    memory: 65,
    cpu: { gsu1: 54, gsu2: 87, gsu3: 78 },
    network: 57,
    costOverview: 53,
    scalingMethods: 64,
    costSuggestion: 53,
    cpuVsNetwork: 80,
    reports: { report1: 54, report2: 65, report3: 45 }
  });
});

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`Server: ${message}`); // Corrected template literal
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server and handle WebSocket upgrades
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Corrected template literal
});

// Handle WebSocket upgrade requests
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
