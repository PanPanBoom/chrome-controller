import { Router } from 'express';
import { state } from './state.js';
import { parseToVTT, searchSubtitles } from "wyzie-lib";
// import 'dotenv/config';

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

        state.currentDevice.sendInput(input);

        res.send({status: 'ok'});
    });

    router.post('/input/submit', (req, res) => {
        const { input } = req.body;
        console.log('Submit input: ' + input);

        state.currentDevice.submitInput(input);
        res.send({status: 'ok'});
    });

    router.post('/open', async (req, res) => {
        const { url } = req.body;
        console.log(`Demande d'ouverture : ${url}`);

        // if(isExtensionConnected == false)
        // {
        //     console.log("Lancement du navigateur");
        //     exec(`start opera "${url}"`, (err) => {
        //         console.log(err);
        //     });
        // }

        await state.currentDevice.openUrl(url);
        res.send({ status: 'ok' });
    });

    router.post('/castShow', async (req, res) => {
        const { id, platform, episodeInfo, startTime } = req.body;
        state.serverIp = `http://${req.socket.localAddress?.replace(/^::ffff:/, '')}:${req.socket.localPort}`;

        console.log(`Casting ${id} from ${platform} ${episodeInfo ? `(Episode ${episodeInfo.episode} from Season ${episodeInfo.season})` : ""}`);
        console.log(startTime);

        await state.currentDevice.castShow(platform, id, episodeInfo, startTime);
        res.send({ status: 'ok' });
    });

    router.post('/keypress', (req, res) => {
        const { key, direction } = req.body;
        console.log(`Entrée : ${key}`);

        state.currentDevice.keyPress(key, direction);
        
        res.send({ status: 'ok' });
    });

    router.post('/zoom', (req, res) => {
        const { zoomValue } = req.body;
        
        io.emit('command', { action: "ZOOM", zoomValue});
        res.send({ status: 'ok' });
    });

    router.post('/togglePlayPause', (req, res) => {
        console.log("Play/Pause");
        io.emit('command', { action: "PLAY_PAUSE" });
        res.send({ status: 'ok' });
    });

    router.post('/rewind', (req, res) => {
        console.log('rewind');
        io.emit('command', { action: 'REWIND' });
        res.send({ status: 'ok' });
    });

    router.post('/forward', (req, res) => {
        console.log('forward');
        io.emit('command', { action: 'FORWARD' });
        res.send({ status: 'ok' });
    });

    router.get('/videoEnabled', (req, res) => {
        io.emit('command', { action: 'IS_VIDEO_ENABLED' });
        res.send({ status: 'ok' });
    });

    router.get('/subtitles', async (req, res) => {
        console.log("Fetching subtitles...");
        const episodeInfo = req.query.episodeInfo ? JSON.parse(decodeURIComponent(req.query.episodeInfo)) : null;
        const targetDuration = Number(req.query.duration);

        try {
            console.log("Getting subtitles list...");
            const data = await searchSubtitles({
                tmdb_id: Number(req.query.showId),
                ...(episodeInfo?.season != null && {
                    season: Number(episodeInfo.season),
                    episode: Number(episodeInfo.episode),
                }),
                format: ['srt'],
                language: ['fr'],
                key: process.env.WYZIE_API_KEY
            });

            console.log(data);

            res.json(data);
            return;

            // const checkedSubtitles = await Promise.all(
            //     data.map(async (sub) => {
            //         try {
            //             const response = await fetch(sub.url);
            //             const srtText = await response.text();

            //             const matches = [...srtText.matchAll(/(\d{2}):(\d{2}):(\d{2})[,\.]\d{3}/g)];
            //             if (!matches.length) return null;

            //             const [_, hours, minutes, seconds] = matches[matches.length - 1];
            //             const subDuration = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

            //             // Écart de moins de 60s entre la vidéo et la dernière ligne du SRT
            //             const diff = Math.abs(targetDuration - subDuration);
            //             return diff <= 60 ? sub : null;
            //         } catch {
            //             return null;
            //         }
            //     })
            // );

            // const validSubtitles = checkedSubtitles.filter(Boolean);

            // res.json(validSubtitles.length ? validSubtitles : data);

        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
        }
    })

    router.get('/proxy-subtitles', async (req, res) => {
        console.log('Subtitles proxy');
        try {
            const url = decodeURIComponent(req.query.url);
            const text = await parseToVTT(url);
            // const base64Vtt = Buffer.from(text).toString('base64');

            console.log(text);

            // res.json({ base64: base64Vtt });
            res.send(text);
        } catch (err) {
            res.status(500).send('Proxy subtitles error: ' + err);
        }
    });

    return router;
}