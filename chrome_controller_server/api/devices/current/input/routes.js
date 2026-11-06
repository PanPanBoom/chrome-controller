import { Router } from "express";
import { serverLog } from "../../../../src/utils.js";
import { state } from "../../../../src/state.js";

export default function inputRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.post('/', (req, res) => {
        const { input } = req.body;
        serverLog('Input : ' + input);

        state.currentDevice.sendInput(input);

        res.send({status: 'ok'});
    });

    router.post('/submit', (req, res) => {
        const { input } = req.body;
        serverLog('Submit input: ' + input);

        state.currentDevice.submitInput(input);
        res.send({status: 'ok'});
    })
    
    return router;
}