import { Api } from "../Api.js";
import 'dotenv/config';
import { runAt } from '../../utils.js';

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
                displayText: "Films",
                apiValue: "movie"
            },
            {
                displayText: "Séries",
                apiValue: "tv"
            }
        ];
        this.platform = 'tmdb';

        runAt(0, 0, () => this.cache = {});
    }

    async fetchApi(endpoint)
    {
        return fetch(`https://api.themoviedb.org/3/${endpoint}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        }).then(res => res.json());
    }

    async sendTopShowsRequest(filter)
    {
        return this.fetchApi(`trending/${filter}/day?language=fr-FR`)
                .then(data => data?.results);
    }

    async getListById(listId, page)
    {
        const params = new URLSearchParams();
        params.append('language', 'fr-FR');
        params.append('page', page);

        return await this.fetchApi(`list/${listId}?${params}`);
    }

    async discoverShows(filter, paramsObject)
    {
        const params = new URLSearchParams();

        for(const [key, value] of Object.entries(paramsObject))
            params.append(key, value);

        params.append('language', 'fr-FR');

        return this.fetchApi(`discover/${filter}?${params}`);
    }

    async searchShowsByTitle(title, filter)
    {
        return this.fetchApi(`search/${filter === "all" ? "multi" : filter}?query=${title}&language=fr-FR`);
    }

    async getCollection(id)
    {
        return await this.fetchApi(`collection/${id}?language=fr-FR`);
    }

    async getSimilarShows(id)
    {
        return await this.fetchApi(`${id}/similar?language=fr-FR`);
    }

    async getShowById(id)
    {
        return this.fetchApi(`${id}?language=fr-FR&append_to_response=credits,watch/providers,videos,combined_credits`);
                // .then(async (show) => await createFromTMDB(id, show, this));
    }

    // async getShowMinimalById(id)
    // {
    //     const mediaType = id.split('/')[0];

    //     return this.fetchApi(`${id}?language=fr-FR`)
    //             .then(async (show) => await formatForCarousel(mediaType, show, this));
    // }

    async getSeasonByNumber(showId, seasonNumber)
    {
        const params = new URLSearchParams();
        params.append('append_to_response', 'credits');

        let language = 'fr-FR';
        if(seasonNumber == 0)
        {
            const show = await this.fetchApi(showId);
            language = `${show.original_language}-${show.origin_country}`;
        }

        params.append('language', language);

        return this.fetchApi(`${showId}/season/${seasonNumber}?${params}`)
    }

    async getShowReview(id)
    {
        return this.fetchApi(`${id}/reviews`);
    }

    async getEpisode(showId, episodeInfo)
    {
        return this.fetchApi(`${showId}/season/${episodeInfo?.season ?? 1}/episode/${episodeInfo?.episode ?? 1}`)
            // .then(episode => Episode.details(episode, this));
    }

    async getCombinedCredits(personId)
    {
        return this.fetchApi(`${personId}/combined_credits?language=fr-FR`);
    }

    // async getPeopleFilmography(id)
    // {
    //     return this.fetchApi(`${id}/combined_credits?language=fr-FR`)
    //         .then(async data => await People.buildFilmography(data.cast, this));
    // }

    // async getPeopleProductions(id)
    // {
    //     return this.fetchApi(`${id}/combined_credits?language=fr-FR`)
    //         .then(data => People.buildProductions(data.crew, this));
    // }

    async getCredit(creditId)
    {
        return this.fetchApi(`credit/${creditId}?language=fr-FR`)
    }
}