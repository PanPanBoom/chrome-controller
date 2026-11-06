import { Router } from "express";
import { serverLog } from "../../../src/utils.js";

export default function extensionRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.get('/fullscreen', (req, res) => {
        serverLog('Fullscreen');
        io.emit('command', { action: 'FULLSCREEN' });
        res.send({ status: 'ok' });
    });

    router.post('/zoom', (req, res) => {
        const { zoomValue } = req.body;
        
        io.emit('command', { action: "ZOOM", zoomValue});
        res.send({ status: 'ok' });
    });

    router.post('/togglePlayPause', (req, res) => {
        serverLog("Play/Pause");
        io.emit('command', { action: "PLAY_PAUSE" });
        res.send({ status: 'ok' });
    });

    router.post('/rewind', (req, res) => {
        serverLog('rewind');
        io.emit('command', { action: 'REWIND' });
        res.send({ status: 'ok' });
    });

    router.post('/forward', (req, res) => {
        serverLog('forward');
        io.emit('command', { action: 'FORWARD' });
        res.send({ status: 'ok' });
    });
    
    return router;
}