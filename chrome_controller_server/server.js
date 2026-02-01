const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const { exec } = require('child_process');
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

app.post('/open', (req, res) => {
    const { url } = req.body;
    console.log(`Demande d'ouverture : ${url}`);

    io.emit('command', { action: 'OPEN_TAB', url });
    res.send({ status: 'ok' });
});

app.post('/keypress', (req, res) => {
    const { key } = req.body;
    console.log(`Entrée : ${key}`);

    // let linuxCommand = "";

    // switch (key) {
    //     case 'ArrowRight': linuxCommand = 'xdotool key Right'; break;
    //     case 'ArrowLeft':  linuxCommand = 'xdotool key Left'; break;
    //     case 'ArrowUp':    linuxCommand = 'xdotool key Up'; break;
    //     case 'ArrowDown':  linuxCommand = 'xdotool key Down'; break;
    //     case 'Enter':      linuxCommand = 'xdotool key Return'; break; // Attention c'est 'Return' sur Linux
    //     case ' ':          linuxCommand = 'xdotool key space'; break;
    //     case 'f':          linuxCommand = 'xdotool key f'; break;
    // }

    // if (linuxCommand) {
    //     exec(linuxCommand, (error) => {
    //         if (error) console.error("Erreur xdotool:", error);
    //     });
    // }

    // res.send({ status: 'ok' });

    let action = "NAVIGATE";
    if(key === " ")
        action = "VALIDATION";
    else if(key === "Back")
        action = "GO_BACK";

    io.emit('command', { action: action, key});
    res.send({ status: 'ok' });
})

server.listen(3000, '0.0.0.0', () => {
    console.log('Serveur actif sur localhost:3000');
});