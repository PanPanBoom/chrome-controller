import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import remoteRoutes from './src/remote.js';
import extensionRoutes from './src/extension.js';
import { ApiManager } from './src/APIs/ApiManager.js';
import { getShowByTitle, removeShowByTitle, saveShow } from './src/db.js';
import { state } from './src/state.js';
import fs from 'fs';
import { Extension } from './src/devices/Extension.js';
import { AndroidTv } from './src/devices/AndroidTv.js';
import { Readable } from 'stream';

const app = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });
let currentShowTitle = "";

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

    state.currentDevice.handleVolume(volumeValue);
    
    res.send({ status: 'ok' });
})

app.post('/mute', async (req, res) => {
    await state.currentDevice.toggleMute();

    res.send({ status: 'ok', isMuted: state.currentDevice.isMuted});
})

app.get('/isMuted', async (req, res) => res.send({ status: 'ok', isMuted: state.currentDevice.isMuted}))

app.post('/addFavorite', async (req, res) => {
    let showApiData = await ApiManager.apis.netflix.getShowByTitle(currentShowTitle);
    showApiData.title = currentShowTitle;
    
    saveShow(showApiData);
    console.log(`${currentShowTitle} added to favorites`);
    
    res.send({ status: 'ok' });
});

app.delete('/removeFavorite', async (req, res) => {
    removeShowByTitle(currentShowTitle);

    console.log(`${currentShowTitle} removed from favorites`);
    
    res.send({ status: 'ok' });
});

app.post('/showUpdate', async (req, res) => {
    const { title } = req.body;
    currentShowTitle = title.split('(')[0].trimEnd();
    console.log('new show sent by extension:', title);
    if(title === "")
        io.emit('disabledFavorite');
    else
        io.emit(`${getShowByTitle(currentShowTitle) ? 'active' : 'inactive'}Favorite`);
    res.send({ status: 'ok' });
})

app.post('/connectTv', async (req, res) => {
    const { ip } = req.body;

    if(ip != "")
    {
        state.currentDevice = new AndroidTv(ip);
        const isStarted = await state.currentDevice.init();
        if(!isStarted)
            return res.status(401).send({ status: 'error', message: 'Connection aborted' });
    }

    else
        state.currentDevice = new Extension();

    res.send({ status: 'ok' });
})

app.post('/tvCode', async (req, res) => {
    const { code } = req.body;

    console.log(`Received code: ${code}`);
    console.log(state.currentDevice);

    if (!state.currentDevice)
        return res.status(400).send({ status: 'error', message: 'No device connected' });

    await state.currentDevice.sendCode(code);

    res.send({ status: 'ok' });
});

app.get('/proxy', async (req, res) => {
    const videoUrl = req.query.url;

    console.log('Proxy for ' + videoUrl);

    const response = await fetch(videoUrl, {
        headers: {
            'Referer': 'https://noxpulse.cc',
            'Origin': 'https://noxpulse.cc',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'fr-FR,fr;q=0.9',
            'Range': 'bytes=0-',
        }
    });

    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Length', response.headers.get('content-length'));

    Readable.fromWeb(response.body).pipe(res);
})

server.listen(3000, '0.0.0.0', () => {
    console.log('Serveur actif sur localhost:3000');
});