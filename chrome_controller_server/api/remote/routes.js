import { Router } from 'express';
import { serverLog } from '../../src/utils.js';
import { remoteConstants } from '../../src/constants.js';

export default function remoteRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.get('/config', (req, res) => {
        serverLog(`Constantes chargées : ${JSON.stringify(remoteConstants)}`);
        res.json(remoteConstants);
    })
    
    return router;
}