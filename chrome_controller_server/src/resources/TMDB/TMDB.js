import { ShowScrapper } from "../../source/ShowScrapper.js";
import { serverLog, slugify } from "../../utils.js";
import { Resource } from "../Resource.js";
import { TMDBApi } from "./TMDBApi.js";
import { TMDBMapperManager } from "./TMDBMapperManager.js";
import { baseListsFilters, specificListsFilters } from "./lists.js";
import { getAllShows, getShowsByFilter } from "../../db.js";
import { excludedGenreIds } from "./mappers/People.js";
import * as Credit from './domain/Credit.js';

export class TMDB extends Resource
{
    constructor()
    {
        super(new TMDBApi(), new TMDBMapperManager());
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
        this.scrapper = new ShowScrapper(this);
    }

    searchShowsByTitle(title, filter)
    {
        return this.api.searchShowsByTitle(title, filter)
            .then(shows => shows.results.map(show => this.mapper.carousel({...show, media_type: show.media_type ?? filter})))
    }

    async getLists(filter)
    {
        const lists = await super.getLists(filter);

        return {
            "Reprendre": {id: "reprendre", shows: await Promise.all((filter === "all" ? getAllShows() : getShowsByFilter(filter)).map((show) => {
                return this.api.getShowById(show.id)
                    .then(tmdbShow => this.mapper.carousel({...tmdbShow, media_type: show.id.split('/')[0]}));
            }))},
            ...lists
        };
    }

    async sendListsRequest(filter)
    {
        const baseListsArray = await Promise.all(Object.entries(baseListsFilters).map(async ([label, params]) => {
            const shows = await this.discoverShows(filter, params);
            const formattedShows = shows.results.map(show => this.mapper.carousel(show));

            return [ label, {shows: formattedShows, id: slugify(label), mediaType: filter} ];
        }));

        const specificListsArray = await Promise.all(Object.entries(specificListsFilters).map(async ([filterKey, filterLists]) => {
            if(filterKey === filter || filter === "all")
                return await Promise.all(Object.entries(filterLists).map(async ([label, params]) => {
                    const shows = await this.discoverShows(filterKey, params);
                    const formattedShows = shows.results.map(show => this.mapper.carousel(show));

                    return [ label, {shows: formattedShows, id: slugify(label), mediaType: filterKey} ];
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
        const first = await this.api.getListById(listId, 1);
        const last = Math.ceil(first.item_count / first.items.length);

        const rest = await Promise.all(Array.from({ length: Math.max(0, last - 1) }, (_, i) => this.api.getListById(listId, i + 2)));

        const items = [first, ...rest].flatMap((r) => r.items).map(show => this.mapper.carousel(show));

        return { 
            [first.name]: {
                id: slugify(first.name),
                shows: filter === 'all' ? items : items.filter(item => item.media_type === filter)
            } 
        };
    }

    async getShowById(id)
    {
        const [media_type, _] = id.split('/');
        const show = await this.api.getShowById(id);

        let showsInCollection = [];
        
        if(show.belongs_to_collection)
        {
            const collection = await this.api.getCollection(show.belongs_to_collection.id);
            showsInCollection = collection.parts
                .filter(showInCollection => showInCollection.id !== show.id)
                .map((showInCollection) => this.mapper.carousel(showInCollection));
        }

        const similarShows = [...(await this.api.getSimilarShows(id))?.results]
            ?.sort((a, b) => b.popularity - a.popularity)
            .map(show => this.mapper.carousel({ ...show, media_type }));

        return this.mapper.details({ ...show, media_type }, showsInCollection, similarShows);
    }

    async getPersonById(id)
    {
        const person = await this.api.getShowById(id);
        const mainShows = person?.known_for_department === 'Acting' ? 
            person?.combined_credits?.cast
                ?.filter(show => !show?.genre_ids?.some((g) => excludedGenreIds.includes(g)))
                ?.filter(show => (show.order ?? 0) <= 5)
            : 
            person?.combined_credits?.crew
                ?.filter(show => person?.known_for_department === show?.department)
                ?.filter(show => !show?.genre_ids?.some((g) => excludedGenreIds.includes(g)));
        
        mainShows?.sort((a, b) => b.vote_count - a.vote_count);

        return this.mapper.details({ ...person, media_type: 'person' }, mainShows.map(show => this.mapper.carousel(show)));
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
            for(let i = 0; i < Math.max(movies.results.length, tvShows.results.length); i++)
            {
                if(movies.results[i]) mixedResults.push(movies.results[i]);
                if(tvShows.results[i]) mixedResults.push(tvShows.results[i]);
            }

            return {
                total_pages: Math.max(movies.total_pages, tvShows.total_pages),
                results: mixedResults.slice(0, 20)
            };
        }

        return this.api.discoverShows(filter, paramsObject)
            .then(list => {
                return {
                    total_pages: list.total_pages,
                    results: list.results.map(show => ({ ...show, media_type: filter }))
                };
            }
        );
    }

    getSeasonByNumber(showId, seasonNumber)
    {
        return this.api.getSeasonByNumber(showId, seasonNumber)
            .then(season => this.mapper.season(season));
    }    

    getShowReview(showId)
    {
        return this.api.getShowReview(showId)
            .then(reviews => reviews?.results?.map(review => this.mapper.review(review)));
    }

    getUniqueCredits(credits, attribute)
    {
        const uniqueShowsMap = new Map();

        credits.forEach(show => {
            if (uniqueShowsMap.has(show.id))
            {
                const existing = uniqueShowsMap.get(show.id);

                if (show[attribute] && existing[attribute])
                {
                    const characters = existing[attribute].split(', ');
                    if (!characters.includes(show[attribute]))
                        existing[attribute] = `${existing[attribute]}, ${show[attribute]}`;
                } 
                
                else if (show[attribute] && !existing[attribute]) 
                    existing[attribute] = show[attribute];
            } 
            
            else 
                uniqueShowsMap.set(show.id, { ...show });
        });

        return Promise.all(Array.from(uniqueShowsMap.values())
            .map(async show => {
                const votes = show.vote_count ?? 0;
                const order = show.order ?? Credit.appearanceCount(await this.api.getCredit(show.credit_id));
                const orderWeight = 2000;

                return this.mapper.list(show, show[attribute], votes + ((show.order != null ? -1 : 1) * order * orderWeight));
            }));
    }

    getFilmography(personId)
    {
        return this.api.getCombinedCredits(personId)
            .then(credits => this.getUniqueCredits(credits.cast.filter(show => this.mapper.mappers.person.isShowInFilmography(show)), 'character'));
    }

    getProductions(personId)
    {
        return this.api.getCombinedCredits(personId)
            .then(credits => this.getUniqueCredits(credits.crew, 'job'));
    }

    async getNextEpisodeInfo(showId, episodeInfo)
    {
        const episodeInfos = [
            { season: episodeInfo.season, episode: episodeInfo.episode + 1},
            { season: episodeInfo.season + 1, episode: 1}
        ];
        
        for(const currentEpisodeInfo of episodeInfos)
        {
            try
            {
                await this.api.getEpisode(showId, currentEpisodeInfo);
    
                return currentEpisodeInfo;
            }

            catch(e) {}
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