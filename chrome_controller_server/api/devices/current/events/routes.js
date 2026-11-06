import { Router } from "express";

export default function eventsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.post('/input-focus', (req, res) => {
        serverLog("Trigger le clavier sur l'application");
        io.emit('keyboard');
        res.send({ status : 'ok' });
    });

    router.post('/state', (req, res) => {
        res.send({status: 'ok'});
    })
    
    return router;
}