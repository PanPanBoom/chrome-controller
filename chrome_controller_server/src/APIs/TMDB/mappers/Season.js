import { dateParser } from "../../../utils.js";
import { Episode } from "./Episode.js";

export class Season
{
    static buildData(rawTMDBData, tmdbApi)
    {
        return {
            id: rawTMDBData.id,
            season_number: rawTMDBData.season_number,
            episode_count: rawTMDBData.episode_count,
            air_date: dateParser(rawTMDBData.air_date),
            poster_path: rawTMDBData.poster_path && (tmdbApi.imageBaseUrl + rawTMDBData.poster_path),
            vote_average: rawTMDBData.vote_average,
            overview: rawTMDBData.overview,
            title: rawTMDBData.name,
            cast: rawTMDBData?.credits?.cast?.map(castMember => ({
                id: `person/${castMember.id}`,
                name: castMember.name,
                character: castMember.character,
                img: castMember.profile_path && (tmdbApi.imageBaseUrl + castMember.profile_path)
            })),
            episodes: rawTMDBData.episodes?.map(episode => Episode.buildData(episode, tmdbApi)) || []
        }
    }
}