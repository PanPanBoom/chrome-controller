import { Router } from "express";
import { serverLog } from '../../../src/utils.js';
import { ApiManager } from "../../../src/APIs/ApiManager.js";
import showRoutes from "./[showId]/routes.js";
import { apps } from "../../../src/apps.js";

export default function platformsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:showId', showRoutes(io));

    router.get('/trending', (req, res) => {
        serverLog('Shows demandés');

        serverLog(req.params.platform);
        ApiManager.getTopShows(req.params.platform.toLowerCase(), req.query.showType)
        .then(data => res.json(data));
    });

    router.get('/lists', (req, res) => {
        ApiManager.getLists(req.params.platform.toLowerCase(), req.query.filter)
            .then(data => res.json(data));
    });

    router.get('/search', (req, res) => {
        serverLog('Recherche de show: ' + req.query.search);
        ApiManager.searchShowsByTitle(req.params.platform.toLowerCase(), req.query.search, req.query.filter)
            .then(data => res.json(data));
    });

    router.get('/filters', (req, res) => res.json(ApiManager.apis[req.params.platform].filters))

    return router;
}