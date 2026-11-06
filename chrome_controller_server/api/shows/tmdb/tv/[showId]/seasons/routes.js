import { Router } from "express";
import seasonRoutes from "./[seasonNumber]/routes.js";

export default function seasonsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:seasonNumber', seasonRoutes(io));
    
    return router;
}