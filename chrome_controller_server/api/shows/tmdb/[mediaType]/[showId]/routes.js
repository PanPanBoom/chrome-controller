import { Router } from "express";
import { ApiManager } from "../../../../../src/APIs/ApiManager.js";

export default function showRoutes(io)
{
    const router = new Router({ mergeParams: true });

    const generateTmdbId = (req, res, next) => {
        req.tmdbId = `${req.params.mediaType}/${req.params.showId}`;

        next();
    }

    router.use(generateTmdbId);

    router.get('/', (req, res) => {
        ApiManager.getShowById(req.tmdbId)
            .then(data => res.json(data));
    });

    // router.post('/favorite', async (req, res) => {
    //     let showApiData = await ApiManager.apis.netflix.getShowByTitle(currentShowTitle);
    //     showApiData.title = currentShowTitle;
        
    //     saveShow(showApiData);
    //     serverLog(`${currentShowTitle} added to favorites`);
        
    //     res.send({ status: 'ok' });
    // });

    // router.delete('/favorite', (req, res) => {
    //     removeShowByTitle(currentShowTitle);
        
    //     serverLog(`${currentShowTitle} removed from favorites`);
        
    //     res.send({ status: 'ok' });
    // });

    router.get('/reviews', (req, res) => {
        ApiManager.apis.tmdb.getShowReview(req.tmdbId)
            .then(data => res.json(data));
    })
    
    return router;
}