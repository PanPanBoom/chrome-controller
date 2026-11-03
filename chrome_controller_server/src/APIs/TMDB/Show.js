import { getShowById } from "../../db.js";

export class Show
{
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
                    tmdbApi.imageBaseUrl + showInCollection.backdrop_path,
                    showInCollection.overview,
                    showInCollection.media_type
                )));
        }

        const similarShows = (await tmdbApi.getSimilarShows(tmdbId)).results;
        similarShows?.sort((a, b) => b.popularity - a.popularity);

        const mediaType = tmdbId.split('/')[0];

        return {
            id: tmdbId,
            img: tmdbApi.imageBaseUrl + rawTMDBData.poster_path,
            overview: rawTMDBData.overview,
            media_type: mediaType,
            genres: rawTMDBData.genres.map(genre => genre.name),
            vote_average: Math.round(rawTMDBData.vote_average * 100) / 100,
            vote_count: rawTMDBData.vote_count,
            cast: rawTMDBData?.credits?.cast?.map(castMember => ({
                id: castMember.id,
                name: castMember.name,
                character: castMember.character,
                img: castMember.profile_path ? tmdbApi.imageBaseUrl + castMember.profile_path : null
            })),
            platforms: rawTMDBData["watch/providers"]?.results?.FR?.flatrate?.map(provider => ({
                id: provider.provider_id,
                name: provider.provider_name,
                img: tmdbApi.imageBaseUrl + provider.logo_path,
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
                tmdbApi.imageBaseUrl + similarShow.backdrop_path,
                similarShow.overview,
                mediaType
            )))
        };
    }
}