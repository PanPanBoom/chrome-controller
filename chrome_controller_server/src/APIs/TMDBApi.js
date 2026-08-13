import { Api } from "./Api.js";
import 'dotenv/config'

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
    }

    async sendTopShowsRequest(filter)
    {
        return fetch(`https://api.themoviedb.org/3/trending/${filter}/day?language=fr-FR`, this.fetchOptions)
                .then(res => res.json())
                .then(data => data.results.map(show => ({
                    id: show.id,
                    title: show.title ?? show.name,
                    img: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
                    link: `https://noxpulse.cc/watch/${show.media_type === "tv" ? "series" : "movie"}/${show.id}${show.media_type === "tv" ? "/1/1" : ""}`,
                    overview: show.overview,
                    media_type: show.media_type
                })));
    }

    async searchShowsByTitle(title, filter)
    {
        console.log(title, filter);
        return fetch(`https://api.themoviedb.org/3/search/${filter === "all" ? "multi" : filter}?query=${title}&language=fr-FR`, this.fetchOptions)
                .then(res => res.json())
                .then(data => data.results.map(show => ({
                    id: show.id,
                    title: show.title ?? show.name,
                    img: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
                    link: `https://noxpulse.cc/watch/${show.media_type === "tv" ? "series" : "movie"}/${show.id}${show.media_type === "tv" ? "/1/1" : ""}`,
                    overview: show.overview,
                    media_type: show.media_type ?? filter
                })));
    }

    async getShowById(id, mediaType)
    {
        return fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?language=fr-FR&append_to_response=credits,watch/providers`, this.fetchOptions)
                .then(res => res.json())
                .then(show => ({
                    id: show.id,
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
                    media_type: mediaType,
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
                    })) || undefined
                }));
    }

    async getSeasonById(showId, seasonNumber)
    {
        return fetch(`https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?language=fr-FR`, this.fetchOptions)
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
}