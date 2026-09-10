import { Api } from "./Api.js";
import * as streamingAvailability from 'streaming-availability';
import 'dotenv/config';

export class NetflixApi extends Api
{
    constructor()
    {
        super();
        this.platform = "netflix";
        this.apiClient = new streamingAvailability.Client(new streamingAvailability.Configuration({
            apiKey: process.env.STREAMINGAVAILABILITY_API_KEY
        }));
        this.filters = [
            {
                displayText: "Tout",
                apiValue: ""
            },
            {
                displayText: "Séries",
                apiValue: "series"
            },
            {
                displayText: "Films",
                apiValue: "movie"
            }
        ]
    }

    async sendTopShowsRequest(filter)
    {
        let requestParams = {
            country: 'fr',
            service: this.platform,
            outputLanguage: 'fr'
        };

        if(filter !== "")
            requestParams.showType = filter;

        const shows = await this.apiClient.showsApi.getTopShows(requestParams);

        return shows.map(show => this.formatForCarousel(
            show.tmdbId,
            "",
            show.imageSet.horizontalPoster.w1440,
            show.overview,
            show.tmdbId.split('/')[0]
        ));
    }

    async getLists(filter)
    {
        return {}
    }

    async searchShowsByTitle(title, filter)
    {
        console.log(filter);
        
        const searchResult = await this.apiClient.showsApi.searchShowsByFilters({
            keyword: title,
            outputLanguage: 'fr',
            country: 'fr',
            catalogs: [this.platform],
            show_type: filter
        });

        return searchResult.shows.map(show => this.formatForCarousel(
                show.tmdbId,
                "",
                show.imageSet.horizontalPoster.w1440,
                show.overview,
                show.tmdbId.split('/')[0]
        ));
    }

    async getShowByTitle(title)
    {
        const shows = await this.searchShowsByTitle(title);

        return shows.find(show => show.title === title) || shows[0];
    }

    async getShowLink(id)
    {
        const show = await this.apiClient.showsApi.getShow({
            id,
            outputLanguage: 'fr',
            country: 'fr'
       });

       return show.streamingOptions.fr.find(streamingOption => streamingOption.service.id === this.platform).videoLink;
    }

    async getShowIntent(id)
    {
        return await this.getShowLink(id);
    }
}