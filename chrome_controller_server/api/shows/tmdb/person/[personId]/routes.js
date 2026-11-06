import { Router } from "express";
import { ApiManager } from "../../../../../src/APIs/ApiManager.js";

export default function personRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.get('/filmography', (req, res) => {
        ApiManager.apis.tmdb.getPeopleFilmography(`person/${req.params.personId}`)
            .then(data => res.json(data));
    });
    
    return router;
}