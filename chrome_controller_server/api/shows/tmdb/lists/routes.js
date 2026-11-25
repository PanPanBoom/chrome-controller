import { Router } from "express";
import listRoutes from './[listId]/routes.js';

export default function listsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/:listId', listRoutes(io));

    return router;
}