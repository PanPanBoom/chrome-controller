import { dateParser } from "../../../utils.js";

export class Episode
{
    static buildData(rawTMDBData, tmdbApi)
    {
        return {
            id: rawTMDBData.id,
            title: rawTMDBData.name,
            overview: rawTMDBData.overview,
            img: rawTMDBData.still_path && (tmdbApi.imageBaseUrl + rawTMDBData.still_path),
            air_date: dateParser(rawTMDBData.air_date),
            episode_number: rawTMDBData.episode_number,
            runtime: rawTMDBData.runtime,
            season_number: rawTMDBData.season_number
        }
    }
}