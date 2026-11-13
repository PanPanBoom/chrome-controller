import { getShowById } from "../../../db.js";
import { dateParser } from "../../../utils.js";
import { Credit } from "./Credit.js";

export class Show
{
    static mediaType = '';

    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const showInDB = getShowById(tmdbId);
        let showsInCollection = [];
        
        if(rawTMDBData.belongs_to_collection)
        {
            const collection = await tmdbApi.getCollection(rawTMDBData.belongs_to_collection.id);
            showsInCollection = await Promise.all(collection.parts
                .filter(showInCollection => showInCollection.id !== rawTMDBData.id)
                .map(async (showInCollection) => await tmdbApi.formatForCarousel(
                    `${showInCollection.media_type}/${showInCollection.id}`,
                    showInCollection.name ?? showInCollection.title,
                    showInCollection.backdrop_path && (tmdbApi.imageBaseUrl + showInCollection.backdrop_path),
                    showInCollection.overview,
                    showInCollection.media_type
                )));
        }

        const similarShows = (await tmdbApi.getSimilarShows(tmdbId)).results;
        similarShows?.sort((a, b) => b.popularity - a.popularity);

        const mediaType = tmdbId.split('/')[0];

        return {
            id: tmdbId,
            title: this.getTitle(rawTMDBData),
            release_date: dateParser(this.getReleaseDate(rawTMDBData)),
            img: rawTMDBData.poster_path && (tmdbApi.imageBaseUrl + rawTMDBData.poster_path),
            overview: rawTMDBData.overview,
            media_type: mediaType,
            directors: this.getDirectors(rawTMDBData)?.map(director => ({
                id: `person/${director.id}`,
                name: director.name,
                img: director.profile_path && (tmdbApi.imageBaseUrl + director.profile_path),
            })),
            genres: rawTMDBData.genres.map(genre => genre.name),
            vote_average: Math.round(rawTMDBData.vote_average * 100) / 100,
            vote_count: rawTMDBData.vote_count,
            cast: rawTMDBData?.credits?.cast?.map(castMember => ({
                id: `person/${castMember.id}`,
                name: castMember.name,
                character: castMember.character,
                img: castMember.profile_path && (tmdbApi.imageBaseUrl + castMember.profile_path)
            })),
            platforms: rawTMDBData["watch/providers"]?.results?.FR?.flatrate?.map(provider => ({
                id: provider.provider_id,
                name: provider.provider_name,
                img: provider.logo_path && (tmdbApi.imageBaseUrl + provider.logo_path),
            })) || [],
            trailer: rawTMDBData?.videos?.results?.find(video => video.type.toLowerCase() === "trailer" && video.site.toLowerCase() === "youtube" && video.iso_639_1 === "fr" && video.iso_3166_1 === "FR" && !video.name.toLowerCase().includes("vost"))?.key,
            nextStartTime: showInDB?.nextStartTime,
            currentEpisodeInfo: showInDB && {
                season: showInDB?.currentSeason,
                episode: showInDB?.currentEpisode
            },
            collection: showsInCollection,
            similars: similarShows && await Promise.all(similarShows?.map(async (similarShow) => await tmdbApi.formatForCarousel(
                `${mediaType}/${similarShow.id}`,
                similarShow.title ?? similarShow.name,
                similarShow.backdrop_path && (tmdbApi.imageBaseUrl + similarShow.backdrop_path),
                similarShow.overview,
                mediaType
            )))
        };
    }

    static async formatForCarousel(rawTMDBData, tmdbApi)
    {
        const id = `${this.mediaType}/${rawTMDBData.id}`;
        const base = tmdbApi.formatForCarousel(
            id,
            this.getTitle(rawTMDBData),
            rawTMDBData.backdrop_path && (tmdbApi.imageBaseUrl + rawTMDBData.backdrop_path),
            rawTMDBData.overview,
            this.mediaType
        );

        const showFromDB = getShowById(id);
        if(showFromDB?.currentEpisode)
        {
            const episode = await tmdbApi.getEpisode(id, { season: showFromDB.currentSeason, episode: showFromDB.currentEpisode});
            base.img = episode.img;
        }

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

    static async formatForList(rawTMDBData, tmdbApi, info)
    {
        return tmdbApi.formatForList(
            `${this.mediaType}/${rawTMDBData.id}`,
            this.getTitle(rawTMDBData),
            rawTMDBData.poster_path && (tmdbApi.imageBaseUrl + rawTMDBData.poster_path),
            dateParser(this.getReleaseDate(rawTMDBData)),
            info,
            rawTMDBData?.order,
            Credit.getApparitions(await tmdbApi.getCredit(rawTMDBData.credit_id)),
            rawTMDBData.vote_count,
            this.mediaType
        );
    }

    static getReleaseDate(rawTMDBData)
    {
        return null;
    }

    static getTitle(rawTMDBData)
    {
        return null;
    }

    static getDirectors(rawTMDBData)
    {
        return null;
    }
}