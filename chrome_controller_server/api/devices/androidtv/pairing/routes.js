import { Router } from "express";
import { state } from "../../../../src/state.js";
import { serverLog } from "../../../../src/utils.js";
import { AndroidTv } from "../../../../src/devices/AndroidTv.js";
import { Extension } from "../../../../src/devices/Extension.js";

export default function pairingRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.post('/', async (req, res) => {
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
    });

    router.post('/code', (req, res) => {
        const { code } = req.body;
        
        serverLog(`Received code: ${code}`);

        if (!state.currentDevice)
            return res.status(400).send({ status: 'error', message: 'No device connected' });

        state.currentDevice.sendCode(code);
        
        res.send({ status: 'ok' });
    })
    
    return router;
}