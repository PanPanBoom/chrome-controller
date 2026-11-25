import { Router } from "express";
import { ResourceManager } from "../../../../src/resources/ResourceManager.js";

export default function listsRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.get('/', (req, res) => {
        ResourceManager.getLists(req.params.platform.toLowerCase(), req.query.filter)
            .then(data => res.json(data));
    });

    return router;
}