import { Router } from "express";
import tvShowRoutes from "./[showId]/routes.js";

export default function tvShowsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:showId', tvShowRoutes(io));
    
    return router;
}