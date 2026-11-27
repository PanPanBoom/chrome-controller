import { serverLog } from "../../utils.js";
import { Movie } from "./mappers/Movie.js";
import { People } from "./mappers/People.js";
import { Series } from "./mappers/Series.js";
import { dateParser } from "../../utils.js";
import { TMDBMapper } from "./mappers/TMDBMapper.js";

export class TMDBMapperManager extends TMDBMapper
{
    constructor()
    {
        super();
        this.platform = "tmdb";
        this.mappers = {
            movie: new Movie(),
            tv: new Series(),
            person: new People()
        };
    }

    carousel(show)
    {
        return this.mappers[show.media_type].carousel(show);
    }

    list(show, info = null, relevance = 0)
    {
        return this.mappers[show.media_type].list(show, info, relevance);
    }

    details(show, collection, similars)
    {
        return this.mappers[show.media_type].details(show, collection, similars)
    }

    review(review)
    {
        return {
            id: review.id,
            author: {
                name: review.author,
                username: review.author_details.username,
                avatar: review.author_details.avatar_path && this.imageBaseUrl + review.author_details.avatar_path
            },
            content: review.content,
            date: review.created_at,
            rating: review.author_details.rating
        }
    }

    season(season)
    {
        return {
            id: season.id,
            season_number: season.season_number,
            episode_count: season.episode_count,
            air_date: dateParser(season.air_date),
            poster_path: season.poster_path && (this.imageBaseUrl + season.poster_path),
            vote_average: season.vote_average,
            overview: season.overview,
            title: season.name,
            cast: season?.credits?.cast?.map(castMember => ({
                id: `person/${castMember.id}`,
                name: castMember.name,
                character: castMember.character,
                img: castMember.profile_path && (this.imageBaseUrl + castMember.profile_path)
            })),
            episodes: season.episodes?.map(episode => this.episode(episode)) || []
        }
    }

    episode(episode)
    {
        return {
            id: episode.id,
            title: episode.name,
            overview: episode.overview,
            img: episode.still_path && (this.imageBaseUrl + episode.still_path),
            air_date: dateParser(episode.air_date),
            episode_number: episode.episode_number,
            runtime: episode.runtime,
            season_number: episode.season_number
        }
    }   
}