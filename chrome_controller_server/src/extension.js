import { Router } from 'express';
import { state } from './state.js';
import { parseToVTT, searchSubtitles } from "wyzie-lib";
import webvtt from "node-webvtt";
import { serverLog } from './utils.js';
// import 'dotenv/config';

export default function extensionRoutes(io) {
    const router = Router();

    router.get('/fullscreen', (req, res) => {
        serverLog('Fullscreen');
        io.emit('command', { action: 'FULLSCREEN' });
        res.send({ status: 'ok' });
    });

    router.post('/input', (req, res) => {
        const { input } = req.body;
        serverLog('Input : ' + input);

        state.currentDevice.sendInput(input);

        res.send({status: 'ok'});
    });

    router.post('/input/submit', (req, res) => {
        const { input } = req.body;
        serverLog('Submit input: ' + input);

        state.currentDevice.submitInput(input);
        res.send({status: 'ok'});
    });

    router.post('/open', async (req, res) => {
        const { url } = req.body;
        serverLog(`Demande d'ouverture : ${url}`);

        // if(isExtensionConnected == false)
        // {
        //     serverLog("Lancement du navigateur");
        //     exec(`start opera "${url}"`, (err) => {
        //         serverLog(err);
        //     });
        // }

        await state.currentDevice.openUrl(url);
        res.send({ status: 'ok' });
    });

    router.post('/castShow', async (req, res) => {
        const { id, platform, episodeInfo, startTime, source, language } = req.body;
        serverLog(language);
        state.serverIp = `http://${req.socket.localAddress?.replace(/^::ffff:/, '')}:${req.socket.localPort}`;

        serverLog(`Casting ${id} from ${platform} ${episodeInfo?.season ? `(Episode ${episodeInfo.episode} from Season ${episodeInfo.season})` : ""}`);

        await state.currentDevice.castShow(platform, id, episodeInfo, source, startTime, language);
        res.send({ status: 'ok' });
    });

    router.post('/keypress', (req, res) => {
        const { key, direction } = req.body;
        serverLog(`Entrée : ${key}`);

        state.currentDevice.keyPress(key, direction);
        
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

    router.get('/videoEnabled', (req, res) => {
        io.emit('command', { action: 'IS_VIDEO_ENABLED' });
        res.send({ status: 'ok' });
    });

    router.get('/subtitles', async (req, res) => {
        serverLog("Fetching subtitles...");
        const episodeInfo = req.query.episodeInfo ? JSON.parse(decodeURIComponent(req.query.episodeInfo)) : null;
        const targetDuration = Number(req.query.duration);

        try {
            serverLog("Getting subtitles list...");
            const data = await searchSubtitles({
                tmdb_id: Number(req.query.showId),
                ...(episodeInfo?.season != null && {
                    season: Number(episodeInfo.season),
                    episode: Number(episodeInfo.episode),
                }),
                format: ['srt'],
                language: ['fr', 'en'],
                key: process.env.WYZIE_API_KEY
            });

            const subtitles = data.map(subtitle => ({
                id: subtitle.id,
                title: `${subtitle.display} ${subtitle.release ? `(${subtitle.release})` : ''}`,
                language: subtitle.language,
                url: subtitle.url
            }));

            // serverLog(data);

            const checkedSubtitles = await Promise.all(
                subtitles.map(async (sub) => {
                    try {
                        const response = await fetch(sub.url);
                        const srtText = await response.text();

                        const matches = [...srtText.matchAll(/(\d{2}):(\d{2}):(\d{2})[,\.]\d{3}/g)];
                        if (!matches.length) return null;

                        const [_, hours, minutes, seconds] = matches[matches.length - 1];
                        const subDuration = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

                        return subDuration / targetDuration >= 0.95 && subDuration <= targetDuration + 60 ? { fiability: subDuration / targetDuration, ...sub} : null;
                    } catch {
                        return null;
                    }
                })
            );

            const validSubtitles = checkedSubtitles.filter(Boolean);
            validSubtitles.sort((a, b) => b.fiability - a.fiability);

            // serverLog("Subtitles: ", validSubtitles);

            res.json(validSubtitles.length ? validSubtitles : subtitles);

        } catch (err) {
            serverLog(err.message);
            res.status(500).json({ error: err.message });
        }
    })

    router.get('/proxy-subtitles', async (req, res) => {
        serverLog('Subtitles proxy');
        try {
            const url = decodeURIComponent(req.query.url);
            const vttFile = await parseToVTT(url);
            const parsedVtt = webvtt.parse(vttFile);

            serverLog(parsedVtt.cues);
            
            res.json(parsedVtt.cues);
        } catch (err) {
            res.status(500).send('Proxy subtitles error: ' + err);
        }
    });

    return router;
}