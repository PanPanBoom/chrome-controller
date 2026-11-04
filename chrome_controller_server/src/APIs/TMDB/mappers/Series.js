import { Show } from "./Show.js";
import { dateParser } from "../../../utils.js";

export class Series extends Show
{
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const data = await super.buildData(tmdbId, rawTMDBData, tmdbApi);
        
        return {
            ...data,
            title: rawTMDBData.name,
            release_date: dateParser(rawTMDBData.first_air_date),
            directors: rawTMDBData.created_by?.map(creator => ({
                id: `person/${creator.id}`,
                name: creator.name,
                img: tmdbApi.imageBaseUrl + creator.profile_path,
            })),
            number_of_seasons: rawTMDBData.number_of_seasons,
            number_of_episodes: rawTMDBData.number_of_episodes,
            seasons: rawTMDBData.seasons?.map(season => ({
                id: season.id,
                season_number: season.season_number,
                name: season.name
            })) || undefined,
        };
    }

    static async formatForCarousel(rawTMDBData, tmdbApi)
    {
        return tmdbApi.formatForCarousel(
            `tv/${rawTMDBData.id}`,
            rawTMDBData.name,
            tmdbApi.imageBaseUrl + rawTMDBData.backdrop_path,
            rawTMDBData.overview,
            'tv'
        )
    }
}