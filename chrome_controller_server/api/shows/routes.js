import { Router } from "express";
import platformsRoutes from "./[platform]/routes.js";
import tmdbRoutes from "./tmdb/routes.js";

export default function showsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:platform', platformsRoutes(io));
    router.use('/tmdb', tmdbRoutes(io));

    return router;
}