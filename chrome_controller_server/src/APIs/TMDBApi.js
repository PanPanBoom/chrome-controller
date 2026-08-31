import { Api } from "./Api.js";
import { ApiManager } from "./ApiManager.js";
import 'dotenv/config';
import { NakastreamSource } from "../source/NakastreamSource.js";
import { NoxpulseSource } from "../source/NoxpulseSource.js";
import { MappleTVSource } from "../source/MappleTVSource.js";
import os from 'os';
import { state } from "../state.js";
import { getNextStartTime, getShowById } from "../db.js";

const dateParser = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export class TMDBApi extends Api
{
    constructor()
    {
        super();
        this.filters = [
            {
                displayText: "Tout",
                apiValue: "all"
            },
            {
                displayText: "Séries",
                apiValue: "tv"
            },
            {
                displayText: "Films",
                apiValue: "movie"
            }
        ];
        this.imageBaseUrl = "https://image.tmdb.org/t/p/original";
        this.platform = 'tmdb';
        this.sources = [
            // new StreamoSource(),
            new NakastreamSource(),
            new NoxpulseSource(),
            new MappleTVSource(),
        ]
    }

    async fetchApi(endpoint)
    {
        return fetch(`https://api.themoviedb.org/3/${endpoint}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });
    }

    async sendTopShowsRequest(filter)
    {
        return this.fetchApi(`trending/${filter}/day?language=fr-FR`)
                .then(res => res.json())
                .then(data => data?.results?.map(show => ({
                    id: `${show.media_type}/${show.id}`,
                    title: show.title ?? show.name,
                    img: this.imageBaseUrl + show.backdrop_path,
                    overview: show.overview,
                    media_type: show.media_type,
                    platform: this.platform,
                    nextStartTime: getNextStartTime(`${show.media_type}/${show.id}`)
                })));
    }

    async searchShowsByTitle(title, filter)
    {
        console.log(title, filter);
        return this.fetchApi(`search/${filter === "all" ? "multi" : filter}?query=${title}&language=fr-FR`)
                .then(res => res.json())
                .then(data => data.results.filter(show => show.media_type !== "person").map(show => ({
                    id: `${show.media_type ?? filter}/${show.id}`,
                    title: show.title ?? show.name,
                    img: this.imageBaseUrl + show.backdrop_path,
                    overview: show.overview,
                    media_type: show.media_type ?? filter,
                    platform: this.platform,
                    nextStartTime: getNextStartTime(`${show.media_type ?? filter}/${show.id}`)
                })));
    }

    async getShowById(id)
    {
        return this.fetchApi(`${id}?language=fr-FR&append_to_response=credits,watch/providers,videos`)
                .then(res => res.json())
                .then(async (show) => {
                    const showInDB = getShowById(id);
                    return {
                        id,
                        title: show.title ?? show.name,
                        img: this.imageBaseUrl + show.poster_path,
                        overview: show.overview,
                        genres: show?.genres?.map(genre => genre.name),
                        release_date: show.release_date ? dateParser(show.release_date) : dateParser(show.first_air_date),
                        runtime: show.runtime,
                        vote_average: Math.round(show.vote_average * 100) / 100,
                        cast: show?.credits?.cast?.map(castMember => ({
                            id: castMember.id,
                            name: castMember.name,
                            character: castMember.character,
                            img: castMember.profile_path ? this.imageBaseUrl + castMember.profile_path : null
                        })),
                        director: show?.credits?.crew?.find(crewMember => crewMember.job === "Director")?.name || show.created_by?.map(creator => creator.name).join(', '),
                        platforms: show["watch/providers"].results.FR?.flatrate?.map(provider => ({
                            id: provider.provider_id,
                            name: provider.provider_name,
                            img: this.imageBaseUrl + provider.logo_path,
                        })) || [],
                        number_of_seasons: show.number_of_seasons || null,
                        number_of_episodes: show.number_of_episodes || null,
                        seasons: show.seasons?.map(season => ({
                            id: season.id,
                            season_number: season.season_number,
                            episode_count: season.episode_count,
                            air_date: season.air_date,
                            poster_path: season.poster_path ? this.imageBaseUrl + season.poster_path : null,
                            vote_average: season.vote_average,
                            overview: season.overview,
                            name: season.name
                        })) || undefined,
                        trailer: show?.videos?.results?.find(video => video.type.toLowerCase() === "trailer" && video.site.toLowerCase() === "youtube" && video.iso_639_1 === "fr" && video.iso_3166_1 === "FR" && !video.name.toLowerCase().includes("vost"))?.key,
                        nextStartTime: showInDB?.nextStartTime,
                        currentEpisodeInfo: showInDB && {
                            season: showInDB?.currentSeason,
                            episode: showInDB?.currentEpisode
                        }
                    }
                });
    }

    async getShowMinimalById(id)
    {
        const [mediaType, realId] = id.split('/');

        return this.fetchApi(`${id}?language=fr-FR`)
                .then(res => res.json())
                .then(show => {
                    const showFromDB = getShowById(id);
                    return {
                        id,
                        title: show.title ?? show.name,
                        img: this.imageBaseUrl + show.backdrop_path,
                        overview: show.overview,
                        media_type: mediaType,
                        platform: this.platform,
                        nextStartTime: showFromDB?.nextStartTime,
                        currentEpisodeInfo: showFromDB.currentSeason && {
                            season: showFromDB?.currentSeason,
                            episode: showFromDB?.currentEpisode
                        },
                        percentageWatched: showFromDB?.percentageWatched
                    }
                })
    }

    async getSeasonById(showId, seasonNumber)
    {
        return this.fetchApi(`${showId}/season/${seasonNumber}?language=fr-FR`)
                .then(res => res.json())
                .then(season => ({
                    id: season.id,
                    season_number: season.season_number,
                    episode_count: season.episode_count,
                    air_date: season.air_date,
                    poster_path: season.poster_path ? this.imageBaseUrl + season.poster_path : null,
                    vote_average: season.vote_average,
                    overview: season.overview,
                    name: season.name,
                    episodes: season.episodes?.map(episode => ({
                        id: episode.id,
                        title: episode.name,
                        overview: episode.overview,
                        img: episode.still_path ? this.imageBaseUrl + episode.still_path : null,
                        air_date: episode.air_date,
                        episode_number: episode.episode_number,
                        runtime: episode.runtime,
                        season_number: episode.season_number
                    })) || []
                }));
    }

    async getShowReview(id)
    {
        return this.fetchApi(`${id}/reviews`)
                .then(res => res.json())
                .then(data => data?.results?.map(comment => ({
                    id: comment.id,
                    author: {
                        name: comment.author,
                        username: comment.author_details.username,
                        avatar: comment.author_details.avatar_path && this.imageBaseUrl + comment.author_details.avatar_path
                    },
                    content: comment.content,
                    date: comment.created_at,
                    rating: comment.author_details.rating
                })));
    }

    async checkShowAvailability(id, episodeInfo)
    {
        for (const source of this.sources)
            if (await source.checkShowAvailability(id, episodeInfo))
                return true;

        return false;
    }

    async getShowLink(id, episodeInfo = null)
    {
        for (const source of this.sources)
        {
            if (await source.checkShowAvailability(id, episodeInfo))
            {
                console.log("Show available on " + source.baseUrl);
                return await source.getShowUrl(id, episodeInfo);
            }
        }

        return null;
    }

    async getShowIntent(id, episodeInfo = null, startTime = 0)
    {
        for (const source of this.sources)
        {
            if (await source.checkShowAvailability(id, episodeInfo))
            {
                console.log("Show available on " + source.baseUrl);
                const videoInfo = await source.getShowVideoInfo(id, episodeInfo);
                console.log(videoInfo);
                const params = new URLSearchParams();
                params.append('showId', id);
                if(episodeInfo)
                    params.append('episodeInfo', encodeURIComponent(JSON.stringify(episodeInfo)));

                params.append('url', encodeURIComponent(videoInfo.url));
                params.append('referer', encodeURIComponent(videoInfo.referer));
                params.append('serverIp', encodeURIComponent(state.serverIp));
                params.append('startTime', startTime);
                console.log(`Starting show at ${startTime / 1000}s`);

                return `chromecontroller://play?${params}`;
            }
        }

        return null;
    }
}