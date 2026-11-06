import { Router } from "express";
import { getSources, getSubtitles, launchCast, updateProgress } from "../../../../../src/apiFunctions.js";

export default function movieRoutes(io)
{
    const router = new Router({ mergeParams: true });

    const generateTmdbId = (req, res, next) => {
        req.tmdbId = `movie/${req.params.showId}`;

        next();
    }

    router.use(generateTmdbId);

    router.put('/progress', updateProgress);

    router.get('/sources', getSources);

    router.get('/subtitles', getSubtitles);

    router.post('/end', (req, res) => {
        removeShowById(req.tmdbId);
    
        res.send({ status: 'ok' });
    });

    router.post('/cast', launchCast);
    
    return router;
}