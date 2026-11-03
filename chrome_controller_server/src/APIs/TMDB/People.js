import { serverLog, dateParser } from "../../utils.js";

export class People
{
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const mediaType = tmdbId.split('/')[0];

        const actor = rawTMDBData?.known_for_department === 'Acting';

        return {
            id: tmdbId,
            img: tmdbApi.imageBaseUrl + rawTMDBData.profile_path,
            title: rawTMDBData.name,
            overview: rawTMDBData.biography,
            media_type: mediaType,
            birth_date: dateParser(rawTMDBData.birthday),
            shows: await Promise.all((actor ? rawTMDBData?.combined_credits?.cast : rawTMDBData?.combined_credits?.crew?.filter(show => rawTMDBData?.known_for_department === show?.department))?.map(async (show) => await tmdbApi.formatForCarousel(
                `${show.media_type}/${show.id}`,
                show.title ?? show.name,
                tmdbApi.imageBaseUrl + show.backdrop_path,
                show.overview,
                show.media_type
            )))
        }
    }    
}