import { Router } from "express";
import eventsRoutes from "./events/routes.js";
import inputRoutes from "./input/routes.js";
import { serverLog } from "../../../src/utils.js"
import { state } from "../../../src/state.js"

export default function currentDeviceRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/events', eventsRoutes(io));
    router.use('/input', inputRoutes(io));

    router.post('/volume', (req, res) => {
        const { volumeValue } = req.body;
        
        serverLog(`Volume : ${volumeValue > 0 ? "+" : ""}${volumeValue}`);
    
        state.currentDevice.handleVolume(volumeValue);
        
        res.send({ status: 'ok' });
    });

    router.get('/mute', (req, res) => res.send({ status: 'ok', isMuted: state.currentDevice.isMuted}));

    router.post('/mute', async (req, res) => {
        await state.currentDevice.toggleMute();
        
        res.send({ status: 'ok', isMuted: state.currentDevice.isMuted});
    });

    router.post('/url', (req, res) => {
        const { url } = req.body;
        serverLog(`Demande d'ouverture : ${url}`);

        // if(isExtensionConnected == false)
        // {
        //     serverLog("Lancement du navigateur");
        //     exec(`start opera "${url}"`, (err) => {
        //         serverLog(err);
        //     });
        // }

        state.currentDevice.openUrl(url);
        
        res.send({ status: 'ok' });
    });

    router.post('/keypress', (req, res) => {
        const { key, direction } = req.body;
        serverLog(`Entrée : ${key}`);

        state.currentDevice.keyPress(key, direction);
        
        res.send({ status: 'ok' });
    });
    
    return router;
}