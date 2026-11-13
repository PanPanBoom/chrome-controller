import { Router } from "express";
import { state } from "../../../../../../../../../src/state.js";
import { ApiManager } from "../../../../../../../../../src/APIs/ApiManager.js";
import { getSources, getSubtitles, launchCast, updateProgress } from "../../../../../../../../../src/apiFunctions.js";
import { removeShowById } from "../../../../../../../../../src/db.js";

export default function episodeRoutes(io)
{
    const router = new Router({ mergeParams: true });

    const generateEpisodeInfo = (req, res, next) => {
        req.episodeInfo = {
            season: Number(req.params.seasonNumber),
            episode: Number(req.params.episodeNumber)
        };

        next();
    }

    router.use(generateEpisodeInfo);

    router.get('/sources', getSources);
    
    router.put('/progress', updateProgress);

    router.get('/subtitles', getSubtitles);

    router.post('/end', async (req, res) => {
        state.serverIp = `http://${req.socket.localAddress?.replace(/^::ffff:/, '')}:${req.socket.localPort}`;
        const { audioLanguage } = req.body;
        
        const nextEpisodeInfo = await ApiManager.apis.tmdb.getNextEpisodeInfo(req.tmdbId, req.episodeInfo);
        if(nextEpisodeInfo)
        {
            state.currentDevice.castShow('tmdb', req.tmdbId, nextEpisodeInfo, 0, null, audioLanguage);
            res.send({ status: 'ok' });
            return;
        }
    
        removeShowById(req.tmdbId);
    
        res.send({ status: 'ok' });
    });

    router.post('/cast', launchCast);

    return router;
}