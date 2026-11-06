import { Router } from "express";
import personRoutes from "./[personId]/routes.js";

export default function personsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:personId', personRoutes(io));
    
    return router;
}