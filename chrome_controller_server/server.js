const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const loudness = require('loudness');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const path = require('path');
const COMMANDS = require(path.join(__dirname, '..', 'chrome_controller_extension', 'constants.js'));

app.use(express.json());

app.get('/config/commands', (req, res) => {
    console.log(`Constantes chargées : ${JSON.stringify(COMMANDS)}`);
    res.json(COMMANDS);
})

app.get('/keyboard', (req, res) => {
    console.log("Trigger le clavier sur l'application");
    io.emit('keyboard');
    res.send({ status : 'ok' });
})

app.post('/input', (req, res) => {
    const { input } = req.body;
    console.log('Input : ' + input);

    io.emit('command', { action: 'INPUT', input });
    res.send({status: 'ok'});
})

app.post('/input/submit', (req, res) => {
    const { input } = req.body;
    console.log('Submit input: ' + input);

    io.emit('command', { action: 'SUBMIT', input });
    res.send({status: 'ok'});
})

app.post('/open', (req, res) => {
    const { url } = req.body;
    console.log(`Demande d'ouverture : ${url}`);

    io.emit('command', { action: 'OPEN_TAB', url });
    res.send({ status: 'ok' });
});

app.post('/keypress', (req, res) => {
    const { key } = req.body;
    console.log(`Entrée : ${key}`);

    io.emit('command', { action: "HANDLE", key});
    res.send({ status: 'ok' });
})

app.post('/volume', async (req, res) => {
    const { volumeValue } = req.body;
    console.log(`Volume : ${volumeValue > 0 ? "+" : ""}${volumeValue}`);

    const vol = await loudness.getVolume();
    await loudness.setVolume(vol + volumeValue);

    res.send({ status: 'ok' });
})

server.listen(3000, '0.0.0.0', () => {
    console.log('Serveur actif sur localhost:3000');
});