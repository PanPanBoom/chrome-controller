import { io } from 'socket.io-client'

export const socket = io("http://192.168.1.46:3000", {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Connecté au serveur");
});