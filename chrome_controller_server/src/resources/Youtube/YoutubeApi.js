import { Api } from "../Api.js";
import 'dotenv/config';
import { google } from 'googleapis';

export class YoutubeApi extends Api
{
    constructor()
    {
        super();
        this.platform = "youtube";
        this.apiClient = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY
        });
    }

    sendTopShowsRequest(filter)
    {
        return this.apiClient.videos.list({
            chart: 'mostPopular',
            hl:'fr_FR',
            part:'snippet',
            regionCode: 'fr',
            maxResults: 20
        });
    }

    searchShowsByTitle(title, filter)
    {
        return this.apiClient.search.list({
            part: 'snippet',
            q: title,
            regionCode: 'fr',
            maxResults: 20,
            type: 'video'
        });
    }

    async sendListsRequest(filter)
    {
        return {
            // "Abonnements": await this.getSubscriptionsVideos()
        }
    }

    getShowLink(id)
    {
        return `https://www.youtube.com/watch?v=${id}`;
    }

    getShowIntent(id)
    {
        return this.getShowLink(id);
    }
}