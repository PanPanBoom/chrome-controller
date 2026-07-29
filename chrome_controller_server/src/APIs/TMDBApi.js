import { Api } from "./Api.js";
import 'dotenv/config'

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
                    title: show.title ?? show.name,
                    img: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
                    link: `https://noxpulse.cc/watch/${show.media_type === "tv" ? "series" : "movie"}/${show.id}${show.media_type === "tv" ? "/1/1" : ""}`,
                    overview: show.overview
                })));
    }

    async searchShowsByTitle(title, filter)
    {
        console.log(title, filter);
        return fetch(`https://api.themoviedb.org/3/search/${filter}?query=${title}&language=fr-FR`, this.fetchOptions)
                .then(res => res.json())
                .then(data => data.results.map(show => ({
                    title: show.title ?? show.name,
                    img: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
                    link: `https://noxpulse.cc/watch/${show.media_type === "tv" ? "series" : "movie"}/${show.id}${show.media_type === "tv" ? "/1/1" : ""}`,
                    overview: show.overview
                })));
    }
}