import { Router } from "express";
import episodesRoutes from "./episodes/routes.js";
import { ApiManager } from "../../../../../../../src/APIs/ApiManager.js";

export default function seasonRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/episodes', episodesRoutes(io));

    router.get('/', (req, res) => {
        ApiManager.getSeasonById(req.tmdbId, req.params.seasonNumber)
            .then(data => res.json(data));
    });
    
    return router;
}