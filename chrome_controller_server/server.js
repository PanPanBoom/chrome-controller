import express from 'express';
import { state } from './src/state.js';
import { Extension } from './src/devices/Extension.js';
import { io, app, server } from './src/io.js';
import { serverLog } from './src/utils.js'
import apiRoutes from './api/routes.js';

process.on('uncaughtException', (err) => {
    console.error("uncaughtException:", err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error("Promesse rejetée non gérée:", reason);
});

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
app.use('/api', apiRoutes(io));

server.listen(3000, '0.0.0.0', () => {
    serverLog('Serveur actif sur localhost:3000');
});