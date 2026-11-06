import { Router } from "express";
import { serverLog } from "../../../../src/utils.js";
import { state } from "../../../../src/state.js";

export default function showRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.post('/cast', (req, res) => {
        serverLog(`Casting ${req.params.id} from ${req.params.platform}`);

        state.currentDevice.castShow(req.params.platform, req.params.showId)
            .then(() => res.send({ status: 'ok' }));
    })

    return router;
}