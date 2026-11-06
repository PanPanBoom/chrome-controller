import { Router } from "express";
import episodeRoutes from "./[episodeNumber]/routes.js";

export default function episodesRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:episodeNumber', episodeRoutes(io));
    
    return router;
}