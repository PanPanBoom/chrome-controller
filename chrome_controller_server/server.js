import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import remoteRoutes from './src/remote.js';
import extensionRoutes from './src/extension.js';
import { ApiManager } from './src/APIs/ApiManager.js';
import { getShowByTitle, removeShowByTitle, saveShow, upsertNextStartTime } from './src/db.js';
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

app.put('/updateStartTime', (req, res) => {
    console.log(req.headers['content-type']);
    console.log(req.body);
    const { showId, nextStartTime, episodeInfo, percentageWatched } = req.body;

    upsertNextStartTime(showId, episodeInfo, nextStartTime, percentageWatched);

    res.send({ status: 'ok' });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Serveur actif sur localhost:3000');
});