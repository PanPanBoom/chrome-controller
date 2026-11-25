import { Router } from "express";
import { ResourceManager } from "../../../../../src/resources/ResourceManager.js";
import { serverLog } from "../../../../../src/utils.js";

export default function personRoutes(io)
{
    const router = new Router({ mergeParams: true });
    router.use((req, res, next) => {
        req.tmdbId = `person/${req.params.personId}`;

        next();
    });

    router.get('/', (req, res) => {
        ResourceManager.resources.tmdb.getPersonById(req.tmdbId)
            .then(person => res.json(person));
    })

    router.get('/filmography', (req, res) => {
        ResourceManager.resources.tmdb.getFilmography(req.tmdbId)
            .then(data => res.json(data));
    });

    router.get('/productions', (req, res) => {
        ResourceManager.resources.tmdb.getProductions(req.tmdbId)
            .then(data => res.json(data))
    })
    
    return router;
}