const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

app.post('/open', (req, res) => {
    const { url } = req.body;
    console.log(`Demande d'ouverture : ${url}`);

    io.emit('command', { action: 'OPEN_TAB', url });
    res.send({ status: 'ok' });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Serveur actif sur localhost:3000');
});