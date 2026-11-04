import { Api } from "../Api.js";
import 'dotenv/config';
import { getAllShows, getShowsByFilter, getShowById } from "../../db.js";
import { baseListsFilters, specificListsFilters } from "./lists.js";
import { ShowScrapper } from "../../source/ShowScrapper.js";
import { runAt } from '../../utils.js';
import { Season } from "./mappers/Season.js";
import { Episode } from "./mappers/Episode.js";
import { People } from "./mappers/People.js";
import { createFromTMDB, formatForCarousel } from "./mappers/functions.js";

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
        this.scrapper = new ShowScrapper(this);

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
        });
    }

    async sendTopShowsRequest(filter)
    {
        return this.fetchApi(`trending/${filter}/day?language=fr-FR`)
                .then(res => res.json())
                .then(data => Promise.all(data?.results?.map(async (show) => await formatForCarousel(show.media_type, show, this))));
    }

    async getLists(filter)
    {
        const lists = await super.getLists(filter);

        return {
            "Reprendre": await Promise.all((filter === "all" ? getAllShows() : getShowsByFilter(filter)).map((show) => this.getShowMinimalById(show.id))),
            ...lists
        };
    }

    async sendListsRequest(filter)
    {
        const baseListsArray = await Promise.all(Object.entries(baseListsFilters).map(async ([label, params]) => {
            const shows = await this.discoverShows(filter, params);
            return [ label, shows ];
        }));

        const specificListsArray = await Promise.all(Object.entries(specificListsFilters).map(async ([filterKey, filterLists]) => {
            if(filterKey === filter || filter === "all")
                return await Promise.all(Object.entries(filterLists).map(async ([label, params]) => {
                    const shows = await this.discoverShows(filterKey, params);
                    return [ label, shows ];
                }));

            return [];
        }));

        // serverLog(await this.getListById(84979, filter));

        return {
            ...Object.fromEntries(specificListsArray.flat()),
            // ...(await this.getListById(84979, filter)),
            ...Object.fromEntries(baseListsArray)
        }
    }

    async getListById(listId, filter)
    {
        const get = async (page) => {
            const params = new URLSearchParams();
            params.append('language', 'fr-FR');
            params.append('page', page);

            const res = await this.fetchApi(`list/${listId}?${params}`);
            return await res.json();
        }

        const first = await get(1);
        const last = Math.ceil(first.item_count / first.items.length);

        const rest = await Promise.all(Array.from({ length: Math.max(0, last - 1) }, (_, i) => get(i + 2)));

        const items = await Promise.all([first, ...rest].flatMap((r) => r.items).map(async (show) => await formatForCarousel(show, this)));

        return { [first.name]: filter === 'all' ? items : items.filter(item => item.media_type === filter) };
    }

    async discoverShows(filter, paramsObject)
    {
        if(filter === "all")
        {
            const [movies, tvShows] = await Promise.all([
                this.discoverShows("movie", paramsObject),
                this.discoverShows("tv", paramsObject)
            ]);

            const mixedResults = [];
            for(let i = 0; i < Math.max(movies.length, tvShows.length); i++)
            {
                if(movies[i]) mixedResults.push(movies[i]);
                if(tvShows[i]) mixedResults.push(tvShows[i]);
            }

            return mixedResults.slice(0, 20);
        }

        const params = new URLSearchParams();

        for(const [key, value] of Object.entries(paramsObject))
            params.append(key, value);

        params.append('language', 'fr-FR');

        const res = await this.fetchApi(`discover/${filter}?${params}`);
        const data = await res.json();

        return Promise.all(data?.results?.map(async (show) => await formatForCarousel(filter, show, this)));
    }

    async searchShowsByTitle(title, filter)
    {
        return this.fetchApi(`search/${filter === "all" ? "multi" : filter}?query=${title}&language=fr-FR`)
                .then(res => res.json())
                .then(data => Promise.all(data.results.map(async (show) => await formatForCarousel(show.media_type ?? filter, show, this))));
    }

    async getCollection(id)
    {
        return this.fetchApi(`collection/${id}?language=fr-FR`)
            .then(res => res.json());
    }

    async getSimilarShows(id)
    {
        return this.fetchApi(`${id}/similar?language=fr-FR`)
            .then(res => res.json());
    }

    async getShowById(id)
    {
        return this.fetchApi(`${id}?language=fr-FR&append_to_response=credits,watch/providers,videos,combined_credits`)
                .then(res => res.json())
                .then(async (show) => await createFromTMDB(id, show, this));
    }

    async getShowMinimalById(id)
    {
        const mediaType = id.split('/')[0];

        return this.fetchApi(`${id}?language=fr-FR`)
                .then(res => res.json())
                .then(async (show) => await formatForCarousel(mediaType, show, this));
    }

    async getSeasonById(showId, seasonNumber)
    {
        return this.fetchApi(`${showId}/season/${seasonNumber}?language=fr-FR&append_to_response=credits`)
                .then(res => res.json())
                .then(season => Season.buildData(season, this));
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

    async getEpisode(id, episodeInfo)
    {
        return this.fetchApi(`${id}/season/${episodeInfo?.season ?? 1}/episode/${episodeInfo?.episode ?? 1}`)
            .then(res => res.json())
            .then(episode => Episode.buildData(episode, this));
    }

    async getPeopleFilmography(id)
    {
        return this.fetchApi(`${id}/combined_credits?language=fr-FR`)
            .then(res => res.json())
            .then(data => People.buildFilmography(data.cast, this));
    }

    async getNextEpisodeInfo(showId, episodeInfo)
    {
        const endpoints = [
            `${showId}/season/${episodeInfo.season}/episode/${episodeInfo.episode + 1}`,
            `${showId}/season/${episodeInfo.season + 1}/episode/${1}`
        ]
        
        for(const endpoint of endpoints)
        {
            const res = await this.fetchApi(endpoint);
            if(res.status === 404)
                continue;

            const data = await res.json();
            return {
                season: data.season_number,
                episode: data.episode_number
            }
        }

        return null;
    }

    async checkShowAvailability(id, episodeInfo)
    {
        return await this.scrapper.checkShowAvailability(id, episodeInfo);
    }

    async findAvailableSources(id, episodeInfo, onFound)
    {
        return await this.scrapper.findAvailableSources(id, episodeInfo, onFound);
    }

    async getShowLink(id, episodeInfo = null, sourceName = null)
    {
        return await this.scrapper.getShowLink(id, episodeInfo, sourceName);
    }

    async getShowIntent(id, episodeInfo = null, startTime = 0, sourceName = null, audioLanguage = 'fr')
    {
        const showInfos = await this.getShowById(id);
        const intent = await this.scrapper.getShowIntent(id, episodeInfo, startTime, sourceName, audioLanguage);

        return intent + '&title=' + showInfos.title;
    }

    async formatForCarousel(id, title, img, overview, media_type)
    {
        const base = super.formatForCarousel(id, title, img, overview, media_type);
        const showFromDB = getShowById(id);

        if(showFromDB?.currentEpisode)
        {
            const episode = await this.getEpisode(id, { season: showFromDB.currentSeason, episode: showFromDB.currentEpisode});
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
        }
    }
}