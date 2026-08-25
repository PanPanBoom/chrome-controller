import { Api } from "./Api.js";
import { ApiManager } from "./ApiManager.js";
import 'dotenv/config';
import { NakastreamSource } from "../source/NakastreamSource.js";
import { NoxpulseSource } from "../source/NoxpulseSource.js";
import { MappleTVSource } from "../source/MappleTVSource.js";

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
        this.fetchOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        };
        this.platform = 'tmdb';
        this.sources = [
            // new StreamoSource(),
            new NakastreamSource(),
            new NoxpulseSource(),
            new MappleTVSource(),
        ]
    }

    async sendTopShowsRequest(filter)
    {
        return fetch(`https://api.themoviedb.org/3/trending/${filter}/day?language=fr-FR`, this.fetchOptions)
                .then(res => res.json())
                .then(data => data.results.map(show => ({
                    id: `${show.media_type}/${show.id}`,
                    title: show.title ?? show.name,
                    img: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
                    // link: `https://noxpulse.cc/watch/${show.media_type === "tv" ? "series" : "movie"}/${show.id}${show.media_type === "tv" ? "/1/1" : ""}`,
                    overview: show.overview,
                    media_type: show.media_type,
                    platform: this.platform
                })));
    }

    async searchShowsByTitle(title, filter)
    {
        console.log(title, filter);
        return fetch(`https://api.themoviedb.org/3/search/${filter === "all" ? "multi" : filter}?query=${title}&language=fr-FR`, this.fetchOptions)
                .then(res => res.json())
                .then(data => data.results.map(show => ({
                    id: `${show.media_type ?? filter}/${show.id}`,
                    title: show.title ?? show.name,
                    img: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
                    // link: `https://noxpulse.cc/watch/${show.media_type === "tv" ? "series" : "movie"}/${show.id}${show.media_type === "tv" ? "/1/1" : ""}`,
                    overview: show.overview,
                    media_type: show.media_type ?? filter,
                    platform: this.platform
                })));
    }

    async getShowById(id)
    {
        return fetch(`https://api.themoviedb.org/3/${id}?language=fr-FR&append_to_response=credits,watch/providers,videos`, this.fetchOptions)
                .then(res => res.json())
                .then(async (show) => {
                    const trailerYtKey = show?.videos?.results?.find(video => video.type.toLowerCase() === "trailer" && video.site.toLowerCase() === "youtube" && video.iso_639_1 === "fr" && video.iso_3166_1 === "FR").key;
                    
                    return ({
                        id,
                        title: show.title ?? show.name,
                        img: `https://image.tmdb.org/t/p/original${show.poster_path}`,
                        overview: show.overview,
                        genres: show?.genres?.map(genre => genre.name),
                        release_date: show.release_date ? dateParser(show.release_date) : dateParser(show.first_air_date),
                        runtime: show.runtime,
                        vote_average: Math.round(show.vote_average * 100) / 100,
                        cast: show.credits.cast.map(castMember => ({
                            name: castMember.name,
                            character: castMember.character,
                            img: castMember.profile_path ? `https://image.tmdb.org/t/p/original${castMember.profile_path}` : null
                        })),
                        director: show.credits.crew.find(crewMember => crewMember.job === "Director")?.name || null,
                        platforms: show["watch/providers"].results.FR?.flatrate?.map(provider => ({
                            name: provider.provider_name,
                            img: `https://image.tmdb.org/t/p/original${provider.logo_path}`
                        })) || [],
                        number_of_seasons: show.number_of_seasons || null,
                        number_of_episodes: show.number_of_episodes || null,
                        seasons: show.seasons?.map(season => ({
                            id: season.id,
                            season_number: season.season_number,
                            episode_count: season.episode_count,
                            air_date: season.air_date,
                            poster_path: season.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : null,
                            vote_average: season.vote_average,
                            overview: season.overview,
                            name: season.name
                        })) || undefined,
                        trailer: trailerYtKey && await ApiManager.getShowLink("youtube", trailerYtKey)
                    })
                });
    }

    async getSeasonById(showId, seasonNumber)
    {
        return fetch(`https://api.themoviedb.org/3/${showId}/season/${seasonNumber}?language=fr-FR`, this.fetchOptions)
                .then(res => res.json())
                .then(season => ({
                    id: season.id,
                    season_number: season.season_number,
                    episode_count: season.episode_count,
                    air_date: season.air_date,
                    poster_path: season.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : null,
                    vote_average: season.vote_average,
                    overview: season.overview,
                    name: season.name,
                    episodes: season.episodes?.map(episode => ({
                        id: episode.id,
                        title: episode.name,
                        overview: episode.overview,
                        img: episode.still_path ? `https://image.tmdb.org/t/p/original${episode.still_path}` : null,
                        air_date: episode.air_date,
                        episode_number: episode.episode_number,
                        runtime: episode.runtime,
                        season_number: episode.season_number
                    })) || []
                }));
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

    async getShowIntent(id, episodeInfo = null)
    {
        for (const source of this.sources)
        {
            if (await source.checkShowAvailability(id, episodeInfo))
            {
                console.log("Show available on " + source.baseUrl);
                const videoInfo = await source.getShowVideoInfo(id, episodeInfo);
                return `chromecontroller://play?url=${encodeURIComponent(videoInfo.url)}&referer=${encodeURIComponent(videoInfo.referer)}`;
            }
        }

        return null;
    }
}