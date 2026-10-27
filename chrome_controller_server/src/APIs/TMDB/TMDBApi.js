import { Api } from "../Api.js";
import 'dotenv/config';
import { getAllShows, getShowsByFilter, getShowById } from "../../db.js";
import { baseListsFilters, specificListsFilters } from "./lists.js";
import { ShowScrapper } from "../../source/ShowScrapper.js";

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
        this.scrapper = new ShowScrapper(this);
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
                .then(data => data?.results?.map(show => this.formatForCarousel(
                    `${show.media_type}/${show.id}`,
                    show.title ?? show.name,
                    this.imageBaseUrl + show.backdrop_path,
                    show.overview,
                    show.media_type
                )));
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
            ...(await this.getListById(84979, filter)),
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

        const items = [first, ...rest].flatMap((r) => r.items).map(show => this.formatForCarousel(
            `${show.media_type}/${show.id}`,
            show.title ?? show.name,
            this.imageBaseUrl + show.backdrop_path,
            show.overview,
            show.media_type
        ));

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

        return data?.results?.map(show => this.formatForCarousel(
            `${filter}/${show.id}`,
            show.title ?? show.name,
            this.imageBaseUrl + show.backdrop_path,
            show.overview,
            filter
        ));
    }

    async searchShowsByTitle(title, filter)
    {
        return this.fetchApi(`search/${filter === "all" ? "multi" : filter}?query=${title}&language=fr-FR`)
                .then(res => res.json())
                .then(data => data.results.filter(show => show.media_type !== "person").map(show => this.formatForCarousel(
                    `${show.media_type ?? filter}/${show.id}`,
                    show.title ?? show.name,
                    this.imageBaseUrl + show.backdrop_path,
                    show.overview,
                    show.media_type ?? filter
                )));
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
        return this.fetchApi(`${id}?language=fr-FR&append_to_response=credits,watch/providers,videos`)
                .then(res => res.json())
                .then(async (show) => {
                    const showInDB = getShowById(id);
                    let showsInCollection = [];
                    
                    if(show.belongs_to_collection)
                    {
                        const collection = await this.getCollection(show.belongs_to_collection.id);
                        showsInCollection = collection.parts
                            .filter(showInCollection => showInCollection.id !== show.id)
                            .map(showInCollection => this.formatForCarousel(
                                `${showInCollection.media_type}/${showInCollection.id}`,
                                showInCollection.name ?? showInCollection.title,
                                this.imageBaseUrl + showInCollection.backdrop_path,
                                showInCollection.overview,
                                showInCollection.media_type
                            ));
                    }

                    const similarShows = (await this.getSimilarShows(id)).results;
                    similarShows.sort((a, b) => b.popularity - a.popularity);

                    const mediaType = id.split('/')[0];

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
                        platforms: show["watch/providers"]?.results?.FR?.flatrate?.map(provider => ({
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
                        },
                        collection: showsInCollection,
                        similars: similarShows.map(similarShow => this.formatForCarousel(
                            `${mediaType}/${similarShow.id}`,
                            similarShow.title ?? similarShow.name,
                            this.imageBaseUrl + similarShow.backdrop_path,
                            similarShow.overview,
                            mediaType
                        ))
                    }
                });
    }

    async getShowMinimalById(id)
    {
        const [mediaType, realId] = id.split('/');

        return this.fetchApi(`${id}?language=fr-FR`)
                .then(res => res.json())
                .then(show => this.formatForCarousel(
                    id,
                    show.title ?? show.name,
                    this.imageBaseUrl + show.backdrop_path,
                    show.overview,
                    mediaType
                ))
    }

    async getSeasonById(showId, seasonNumber)
    {
        return this.fetchApi(`${showId}/season/${seasonNumber}?language=fr-FR&append_to_response=credits`)
                .then(res => res.json())
                .then(season => ({
                    id: season.id,
                    season_number: season.season_number,
                    episode_count: season.episode_count,
                    air_date: dateParser(season.air_date),
                    poster_path: season.poster_path ? this.imageBaseUrl + season.poster_path : null,
                    vote_average: season.vote_average,
                    overview: season.overview,
                    title: season.name,
                    cast: season?.credits?.cast?.map(castMember => ({
                        id: castMember.id,
                        name: castMember.name,
                        character: castMember.character,
                        img: castMember.profile_path ? this.imageBaseUrl + castMember.profile_path : null
                    })),
                    episodes: season.episodes?.map(episode => ({
                        id: episode.id,
                        title: episode.name,
                        overview: episode.overview,
                        img: episode.still_path ? this.imageBaseUrl + episode.still_path : null,
                        air_date: dateParser(episode.air_date),
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
}