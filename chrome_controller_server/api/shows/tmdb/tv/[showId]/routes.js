import { Router } from "express";
import seasonsRoutes from "./seasons/routes.js";

export default function tvShowRoutes(io)
{
    const router = new Router({ mergeParams: true });

    const generateTmdbId = (req, res, next) => {
        req.tmdbId = `tv/${req.params.showId}`;
        
        next();
    }

    router.use(generateTmdbId);
    router.use('/seasons', seasonsRoutes(io));
    
    return router;
}