import { Router } from "express";
import { serverLog } from '../../../src/utils.js';
import { ResourceManager } from "../../../src/resources/ResourceManager.js";
import showRoutes from "./[showId]/routes.js";
import { apps } from "../../../src/apps.js";
import listsRoutes from "./lists/routes.js";

export default function platformsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:showId', showRoutes(io));
    router.use('/lists', listsRoutes(io));

    router.get('/trending', (req, res) => {
        serverLog('Shows demandés');

        serverLog(req.params.platform);
        ResourceManager.getTopShows(req.params.platform.toLowerCase(), req.query.showType)
            .then(data => res.json(data));
    });

    router.get('/search', (req, res) => {
        serverLog('Recherche de show: ' + req.query.search);
        ResourceManager.searchShowsByTitle(req.params.platform.toLowerCase(), req.query.search, req.query.filter)
            .then(data => res.json(data));
    });

    router.get('/filters', (req, res) => res.json(ResourceManager.resources[req.params.platform].filters))

    return router;
}