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

        return shows.map(show => ({
            title: "",
            img: show.imageSet.horizontalPoster.w1440,
            link: show.streamingOptions.fr.filter(streamingOption => streamingOption.service.id.toLowerCase() === this.platform)[0].link,
            overview: show.overview
        }));
    }

    async getShowByTitle(title)
    {
        const shows = await this.apiClient.showsApi.searchShowsByTitle({
            title,
            outputLanguage: 'fr',
            country: 'fr'
        });

        const show = shows.find(show => show.title === title)

        return {
            id: show.id,
            title: show.title,
            img: show.imageSet.horizontalPoster.w1440,
            link: show.streamingOptions.fr.filter(streamingOption => streamingOption.service.id.toLowerCase() === this.platform)[0].link,
            overview: show.overview
        }
    }
}