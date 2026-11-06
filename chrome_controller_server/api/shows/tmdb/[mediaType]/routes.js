import { Router } from "express";
import showRoutes from "./[showId]/routes.js";

export default function mediaTypeRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:showId', showRoutes(io));

    return router;
}