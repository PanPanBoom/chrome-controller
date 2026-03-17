import { Api } from "./Api.js";
import * as streamingAvailability from 'streaming-availability';
import 'dotenv/config';

export class NetflixApi extends Api
{
    constructor()
    {
        super();
        this.apiClient = new streamingAvailability.Client(new streamingAvailability.Configuration({
            apiKey: process.env.STREAMINGAVAILABILITY_API_KEY
        }));
    }

    async getTopShows(filter)
    {
        if(!this.cache[filter])
            this.cache[filter] = {};
        
        const now = Date.now();

        if(this.cache[filter].data && (now - this.cache[filter].lastFetch) < this.TTL) return this.cache[filter].data;

        let requestParams = {
            country: 'fr',
            service: 'netflix',
            outputLanguage: 'fr'
        };

        if(filter !== "")
            requestParams.showType = filter;

        const data = await this.apiClient.showsApi.getTopShows(requestParams);

        this.cache[filter].data = data.map(show => ({
            title: show.title,
            img: show.imageSet.horizontalPoster.w1440,
            link: show.streamingOptions.fr.filter(streamingOption => streamingOption.service.id.toLowerCase() === "netflix")[0].link,
            overview: show.overview
        }));
        this.cache[filter].lastFetch = now;

        return this.cache[filter].data;
    }
}