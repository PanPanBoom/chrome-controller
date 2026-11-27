import { getShowById } from "../../../db.js";
import { dateParser, serverLog } from "../../../utils.js";
import * as Credit from "../domain/Credit.js";
import { TMDBMapper } from "./TMDBMapper.js";

export class Show extends TMDBMapper
{
    constructor()
    {
        super();

        this.mediaType = '';
    }

    details(show, collection = null, similars = null)
    {
        const base = super.details(show)
        const showInDB = getShowById(base.id);

        return {
            ...base,
            release_date: dateParser(this.getReleaseDate(show)),
            overview: show.overview,
            directors: this.getDirectors(show)?.map(director => ({
                id: `person/${director.id}`,
                name: director.name,
                img: director.profile_path && (this.imageBaseUrl + director.profile_path),
            })),
            genres: show.genres.map(genre => genre.name),
            vote_average: Math.round(show.vote_average * 100) / 100,
            vote_count: show.vote_count,
            cast: show?.credits?.cast?.map(castMember => ({
                id: `person/${castMember.id}`,
                name: castMember.name,
                character: castMember.character,
                img: castMember.profile_path && (this.imageBaseUrl + castMember.profile_path)
            })),
            platforms: show["watch/providers"]?.results?.FR?.flatrate?.map(provider => ({
                id: provider.provider_id,
                name: provider.provider_name,
                img: provider.logo_path && (this.imageBaseUrl + provider.logo_path),
            })) || [],
            trailer: show?.videos?.results?.find(video => video.type.toLowerCase() === "trailer" && video.site.toLowerCase() === "youtube" && video.iso_639_1 === "fr" && video.iso_3166_1 === "FR" && !video.name.toLowerCase().includes("vost"))?.key,
            nextStartTime: showInDB?.nextStartTime,
            currentEpisodeInfo: showInDB && {
                season: showInDB?.currentSeason,
                episode: showInDB?.currentEpisode
            },
            collection,
            similars
        };
    }

    carousel(show)
    {
        const id = `${this.mediaType}/${show.id}`;
        const showFromDB = getShowById(id);

        const base = super.carousel(
            id,
            this.getTitle(show),
            this.imageBaseUrl + (showFromDB?.imgPath ?? show.backdrop_path),
            show.overview,
            this.mediaType
        );

        return {
            ...base,
            nextStartTime: showFromDB?.nextStartTime,
            currentEpisodeInfo: showFromDB?.currentSeason && {
                season: showFromDB?.currentSeason,
                episode: showFromDB?.currentEpisode
            },
            percentageWatched: showFromDB?.percentageWatched
        };
    }

    list(show, info = null, relevance = 0)
    {
        serverLog(info, relevance);
        return super.list(
            `${this.mediaType}/${show.id}`,
            this.getTitle(show),
            show.poster_path && (this.imageBaseUrl + show.poster_path),
            dateParser(this.getReleaseDate(show)),
            info,
            relevance,
            this.mediaType
        );
    }

    getReleaseDate(show)
    {
        return null;
    }

    getDirectors(show)
    {
        return null;
    }
}