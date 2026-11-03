import { Show } from "./Show.js";
import { dateParser } from "../../utils.js";

export class Series extends Show
{
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const data = await super.buildData(tmdbId, rawTMDBData, tmdbApi);
        return {
            ...data,
            title: rawTMDBData.name,
            release_date: dateParser(rawTMDBData.first_air_date),
            director: rawTMDBData.created_by?.map(creator => creator.name).join(', '),
            number_of_seasons: rawTMDBData.number_of_seasons,
            number_of_episodes: rawTMDBData.number_of_episodes,
            seasons: rawTMDBData.seasons?.map(season => ({
                id: season.id,
                season_number: season.season_number,
                name: season.name
            })) || undefined,
        };
    }
}