import { Router } from "express";
import episodesRoutes from "./episodes/routes.js";
import { ResourceManager } from "../../../../../../../src/resources/ResourceManager.js";

export default function seasonRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/episodes', episodesRoutes(io));

    router.get('/', (req, res) => {
        ResourceManager.resources.tmdb.getSeasonByNumber(req.tmdbId, req.params.seasonNumber)
            .then(data => res.json(data));
    });
    
    return router;
}