import { Router } from "express";
import movieRoutes from "./[showId]/routes.js";

export default function moviesRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:showId', movieRoutes(io));
    
    return router;
}