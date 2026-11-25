import { Router } from "express";
import { getFiltersBySlug } from "../../../../../src/resources/TMDB/lists.js";
import { ResourceManager } from "../../../../../src/resources/ResourceManager.js";
import { getMaxPage, getShowsByPage } from "../../../../../src/db.js";
// import { serverLog } from "../../../../../src/utils";

export default function listRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.get('/', async (req, res) => {
        if(req.params.listId === "reprendre")
        {
            return res.json({
                title: "Reprendre", 
                total_pages: getMaxPage(),
                shows: await Promise.all(getShowsByPage(req.query.page).map((show) => ResourceManager.resources.tmdb.api.getShowById(show.id).then(tmdbShow => ResourceManager.resources.tmdb.mapper.list({...tmdbShow, media_type: show.id.split('/')[0]}))))
            });
        }

        const { title, filters, category } = getFiltersBySlug(req.params.listId, req.query.mediaType);
        ResourceManager.resources.tmdb.discoverShows(req.query.mediaType, { ...filters, page: req.query.page })
            .then(async (list) => res.json({
                title,
                total_pages: list.total_pages,
                shows: list.results.map(show => ResourceManager.resources.tmdb.mapper.list(show))
            }));
    });

    return router;
}