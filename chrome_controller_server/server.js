import express from 'express';
import remoteRoutes from './src/remote.js';
import extensionRoutes from './src/extension.js';
import { ApiManager } from './src/APIs/ApiManager.js';
import { getShowByTitle, removeShowById, removeShowByTitle, saveShow, upsertNextStartTime } from './src/db.js';
import { state } from './src/state.js';
import { Extension } from './src/devices/Extension.js';
import { AndroidTv } from './src/devices/AndroidTv.js';
import { io, app, server } from './src/io.js';
import { serverLog } from './src/utils.js'

process.on('uncaughtException', (err) => {
    console.error("uncaughtException:", err.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error("Promesse rejetée non gérée:", reason);
});

let currentShowTitle = "";

let isExtensionConnected = false;

state.currentDevice = new Extension();

io.on("connection", (socket) => {
    socket.on('identify', (role) => {
        if(role === "extension")
        {
            isExtensionConnected = true;
            serverLog("Navigateur détecté");
        }
    });

    socket.on('disconnect', () => {
        isExtensionConnected = false;
        serverLog("Deconnexion de l'extension");
    });
})

app.use(express.json());
app.use('/assets', express.static('assets'));
app.use('/extension', extensionRoutes(io));
app.use('/remote', remoteRoutes(io));

app.post('/volume', async (req, res) => {
    const { volumeValue } = req.body;

    serverLog(`Volume : ${volumeValue > 0 ? "+" : ""}${volumeValue}`);

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
    serverLog(`${currentShowTitle} added to favorites`);
    
    res.send({ status: 'ok' });
});

app.delete('/removeFavorite', async (req, res) => {
    removeShowByTitle(currentShowTitle);

    serverLog(`${currentShowTitle} removed from favorites`);
    
    res.send({ status: 'ok' });
});

app.post('/showUpdate', async (req, res) => {
    const { title } = req.body;
    currentShowTitle = title.split('(')[0].trimEnd();
    serverLog('new show sent by extension:', title);
    if(title === "")
        io.emit('disabledFavorite');
    else
        io.emit(`${getShowByTitle(currentShowTitle) ? 'active' : 'inactive'}Favorite`);
    res.send({ status: 'ok' });
})

app.post('/connectTv', async (req, res) => {
    const { ip } = req.body;

    state?.currentDevice?.closeConnection();

    if(ip !== "")
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

    serverLog(`Received code: ${code}`);

    if (!state.currentDevice)
        return res.status(400).send({ status: 'error', message: 'No device connected' });

    await state.currentDevice.sendCode(code);

    res.send({ status: 'ok' });
});

app.put('/updateStartTime', (req, res) => {
    serverLog(req.body);
    const { showId, nextStartTime, episodeInfo, percentageWatched } = req.body;

    upsertNextStartTime(showId, episodeInfo, nextStartTime, percentageWatched);

    res.send({ status: 'ok' });
});

app.post('/showEnd', async (req, res) => {
    state.serverIp = `http://${req.socket.localAddress?.replace(/^::ffff:/, '')}:${req.socket.localPort}`;
    const { showId, episodeInfo, audioLanguage } = req.body;
    if(episodeInfo)
    {
        const nextEpisodeInfo = await ApiManager.apis.tmdb.getNextEpisodeInfo(showId, episodeInfo);
        if(nextEpisodeInfo)
        {
            state.currentDevice.castShow('tmdb', showId, nextEpisodeInfo, 0, null, audioLanguage);
            res.send({ status: 'ok' });
            return;
        }
    }

    removeShowById(showId);

    res.send({ status: 'ok' });
})

server.listen(3000, '0.0.0.0', () => {
    serverLog('Serveur actif sur localhost:3000');
});