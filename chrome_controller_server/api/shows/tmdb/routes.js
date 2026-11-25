import { Router } from "express";
import mediaTypeRoutes from "./[mediaType]/routes.js";
import moviesRoutes from "./movie/routes.js";
import tvShowsRoutes from "./tv/routes.js";
import personsRoutes from "./person/routes.js"
import listsRoutes from "./lists/routes.js";

export default function tmdbRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/lists', listsRoutes(io));
    router.use('/movie', moviesRoutes(io));
    router.use('/tv', tvShowsRoutes(io));
    router.use('/person', personsRoutes(io));
    router.use('/:mediaType', mediaTypeRoutes(io));

    return router;
}