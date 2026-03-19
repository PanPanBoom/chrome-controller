import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import loudness from 'loudness';
import remoteRoutes from './src/remote.js';
import extensionRoutes from './src/extension.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

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
app.use('/assets', express.static('assets'));
app.use('/extension', extensionRoutes(io));
app.use('/remote', remoteRoutes(io));

app.post('/volume', async (req, res) => {
    const { volumeValue } = req.body;

    console.log(`Volume : ${volumeValue > 0 ? "+" : ""}${volumeValue}`);

    const vol = await loudness.getVolume();
    await loudness.setVolume(vol + volumeValue);
    
    res.send({ status: 'ok' });
})

app.post('/mute', async (req, res) => {
    const isMuted = await loudness.getMuted();

    console.log(isMuted ? "Demute" : "Mute");
    await loudness.setMuted(!isMuted);

    res.send({ status: 'ok', isMuted: !isMuted});
})

app.get('/isMuted', async (req, res) => res.send({ status: 'ok', isMuted: await loudness.getMuted()}))

server.listen(3000, '0.0.0.0', () => {
    console.log('Serveur actif sur localhost:3000');
});