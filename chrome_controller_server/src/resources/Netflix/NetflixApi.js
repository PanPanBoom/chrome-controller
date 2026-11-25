import { Api } from "../Api.js";
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
        ];
        this.paramsBase = {
            country: 'fr',
            outputLanguage: 'fr'
        };
    }

    async sendTopShowsRequest(filter)
    {
        return await this.apiClient.showsApi.getTopShows({
            service: this.platform,
            ...this.paramsBase,
            ...(filter !== "" && { showType: filter})
        });
    }

    async searchShowsByTitle(title, filter)
    {
        return await this.apiClient.showsApi.searchShowsByFilters({
            keyword: title,
            ...this.paramsBase,
            catalogs: [this.platform],
            show_type: filter
        });
    }

    async getShowById(id)
    {
        return await this.apiClient.showsApi.getShow({
            id,
            ...this.paramsBase
       });
    }
}