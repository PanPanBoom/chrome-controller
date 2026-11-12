import { Show } from "./Show.js";

export class Series extends Show
{
    static mediaType = 'tv';
    
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const data = await super.buildData(tmdbId, rawTMDBData, tmdbApi);
        
        return {
            ...data,
            number_of_seasons: rawTMDBData.number_of_seasons,
            number_of_episodes: rawTMDBData.number_of_episodes,
            seasons: rawTMDBData.seasons?.map(season => ({
                id: season.id,
                season_number: season.season_number,
                name: season.name
            })) || undefined,
        };
    }

    static getReleaseDate(rawTMDBData)
    {
        return rawTMDBData.first_air_date;
    }

    static getTitle(rawTMDBData)
    {
        return rawTMDBData.name;
    }

    static getDirectors(rawTMDBData)
    {
        return rawTMDBData.created_by;
    }
}