import { Router } from "express";
import COMMANDS from '../../chrome_controller_extension/constants.js';
import { apps } from "./apps.js";

export default function remoteRoutes(io) {
    const router = Router();
    
    router.get('/ping', (req, res) => {
        res.send('pong');
    });

    router.get('/apps', (req, res) => {
        console.log('Apps demandées');
        res.json(apps);
    });
    
    router.get('/config/commands', (req, res) => {
        console.log(`Constantes chargées : ${JSON.stringify(COMMANDS)}`);
        res.json(COMMANDS);
    });
    
    router.get('/keyboard', (req, res) => {
        console.log("Trigger le clavier sur l'application");
        io.emit('keyboard');
        res.send({ status : 'ok' });
    });

    return router;
}
