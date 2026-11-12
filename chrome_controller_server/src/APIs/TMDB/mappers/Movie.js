import { Show } from "./Show.js";

export class Movie extends Show
{
    static mediaType = 'movie';

    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const data = await super.buildData(tmdbId, rawTMDBData, tmdbApi);
        
        return {
            ...data,
            runtime: rawTMDBData.runtime
        };
    }

    static getReleaseDate(rawTMDBData)
    {
        return rawTMDBData.release_date;
    }

    static getTitle(rawTMDBData)
    {
        return rawTMDBData.title;
    }

    static getDirectors(rawTMDBData)
    {
        return rawTMDBData?.credits?.crew?.filter(crewMember => crewMember.job === "Director");
    }
}