import { Router } from 'express';

export default function extensionRoutes(io) {
    const router = Router();

    router.get('/fullscreen', (req, res) => {
        console.log('Fullscreen');
        io.emit('command', { action: 'FULLSCREEN' });
        res.send({ status: 'ok' });
    });

    router.post('/input', (req, res) => {
        const { input } = req.body;
        console.log('Input : ' + input);

        io.emit('command', { action: 'INPUT', input });
        res.send({status: 'ok'});
    });

    router.post('/input/submit', (req, res) => {
        const { input } = req.body;
        console.log('Submit input: ' + input);

        io.emit('command', { action: 'SUBMIT', input });
        res.send({status: 'ok'});
    });

    router.post('/open', (req, res) => {
        const { url } = req.body;
        console.log(`Demande d'ouverture : ${url}`);

        // if(isExtensionConnected == false)
        // {
        //     console.log("Lancement du navigateur");
        //     exec(`start opera "${url}"`, (err) => {
        //         console.log(err);
        //     });
        // }

        io.emit('command', { action: 'OPEN_TAB', url });
        res.send({ status: 'ok' });
    });

    router.post('/keypress', (req, res) => {
        const { key } = req.body;
        console.log(`Entrée : ${key}`);

        io.emit('command', { action: "HANDLE", key});
        res.send({ status: 'ok' });
    });

    router.post('/zoom', (req, res) => {
        const { zoomValue } = req.body;
        
        io.emit('command', { action: "ZOOM", zoomValue});
        res.send({ status: 'ok' });
    })

    return router;
}