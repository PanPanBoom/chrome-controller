const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const loudness = require('loudness');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const path = require('path');
const COMMANDS = require(path.join(__dirname, '..', 'chrome_controller_extension', 'constants.js'));

let isExtensionConnected = false;

io.on("connection", (socket) => {
    socket.on('identify', (role) => {
        if(role === "extension")
        {
            isExtensionConnected = true;
            console.log("Navigateur détecté");
        }
    });

    socket.on('disconnect', () => {
        isExtensionConnected = false;
        console.log("Deconnexion de l'extension");
    });
})

app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong');
})

app.get('/config/commands', (req, res) => {
    console.log(`Constantes chargées : ${JSON.stringify(COMMANDS)}`);
    res.json(COMMANDS);
});

app.get('/fullscreen', (req, res) => {
    console.log('Fullscreen');
    io.emit('command', { action: 'FULLSCREEN' });
    res.send({ status: 'ok' });
})

app.get('/keyboard', (req, res) => {
    console.log("Trigger le clavier sur l'application");
    io.emit('keyboard');
    res.send({ status : 'ok' });
});

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

    // if(isExtensionConnected == false)
    // {
    //     console.log("Lancement du navigateur");
    //     exec(`start opera "${url}"`, (err) => {
    //         console.log(err);
    //     });
    // }

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