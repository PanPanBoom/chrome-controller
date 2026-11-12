import { Router } from "express";
import { ApiManager } from "../../../../../src/APIs/ApiManager.js";

export default function personRoutes(io)
{
    const router = new Router({ mergeParams: true });
    router.use((req, res, next) => {
        req.tmdbId = `person/${req.params.personId}`;

        next();
    })

    router.get('/filmography', (req, res) => {
        ApiManager.apis.tmdb.getPeopleFilmography(req.tmdbId)
            .then(data => res.json(data));
    });

    router.get('/productions', (req, res) => {
        ApiManager.apis.tmdb.getPeopleProductions(req.tmdbId)
            .then(data => res.json(data))
    })
    
    return router;
}