import { Show } from "./Show.js";
import { dateParser } from "../../../utils.js";

export class Movie extends Show
{
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const data = await super.buildData(tmdbId, rawTMDBData, tmdbApi);
        
        return {
            ...data,
            title: rawTMDBData.title,
            release_date: dateParser(rawTMDBData.release_date),
            runtime: rawTMDBData.runtime,
            directors: rawTMDBData?.credits?.crew?.filter(crewMember => crewMember.job === "Director")?.map(director => ({
                id: `person/${director.id}`,
                name: director.name,
                img: tmdbApi.imageBaseUrl + director.profile_path,
            }))
        };
    }

    static async formatForCarousel(rawTMDBData, tmdbApi)
    {
        return tmdbApi.formatForCarousel(
            `movie/${rawTMDBData.id}`,
            rawTMDBData.title,
            tmdbApi.imageBaseUrl + rawTMDBData.backdrop_path,
            rawTMDBData.overview,
            'movie'
        )
    }
}