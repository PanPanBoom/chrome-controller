import { ApiManager } from "./APIs/ApiManager.js";
import { serverLog } from "./utils.js";
import { state } from "./state.js";

export const getSubtitles = async (req, res) => {
    serverLog("Fetching subtitles...");
    const targetDuration = Number(req.query.duration);

    try {
        serverLog("Getting subtitles list...");
        const data = await searchSubtitles({
            tmdb_id: Number(req.params.showId),
            ...(req.episodeInfo?.season != null && req.episodeInfo),
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
}

export const getSources = async (req, res) => {
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.flushHeaders();
    const send = (obj) => res.write(JSON.stringify(obj) + '\n');

    // serverLog(id, episodeInfo);
    
    let first = true;
    const sources = await ApiManager.apis.tmdb.findAvailableSources(req.tmdbId, req.episodeInfo, () => {
        if(first)
        {
            first = false;
            send({ type: 'availability', available: true });
        }
    });

    if(first)
        send({ type: 'availability', available: false });

    send({ type: 'sources', sources});

    res.end();
}

export const updateProgress = (req, res) => {
    const { nextStartTime, percentageWatched } = req.body;
                
    serverLog(req.body);

    upsertNextStartTime(req.tmdbId, req.episodeInfo, nextStartTime, percentageWatched);

    res.send({ status: 'ok' });
}

export const launchCast = (req, res) => {
    const { startTime, source, language } = req.body;
    serverLog(language);
    state.serverIp = `http://${req.socket.localAddress?.replace(/^::ffff:/, '')}:${req.socket.localPort}`;

    serverLog(`Casting ${req.tmdbId} from tmdb`);

    state.currentDevice.castShow('tmdb', req.tmdbId, req.episodeInfo, source, startTime, language)
        .then(() => res.send({ status: 'ok' }));
}