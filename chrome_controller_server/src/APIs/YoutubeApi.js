import { Api } from "./Api.js";
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

    async sendTopShowsRequest(filter)
    {
        const response = await this.apiClient.videos.list({
            chart: 'mostPopular',
            hl:'fr_FR',
            part:'snippet',
            regionCode: 'fr',
            maxResults: 20
        });

        return response.data.items.map(video => this.formatForCarousel(
            video.id,
            video.snippet.title,
            video.snippet.thumbnails.high.url,
            video.snippet.description
        ));
    }

    async searchShowsByTitle(title, filter)
    {
        const response = await this.apiClient.search.list({
            part: 'snippet',
            q: title,
            regionCode: 'fr',
            maxResults: 20,
            type: 'video'
        });

        return response.data.items.map(video => this.formatForCarousel(
            video.id.videoId,
            video.snippet.title,
            video.snippet.thumbnails.high.url,
            video.snippet.description
        ));
    }

    async sendListsRequest(filter)
    {
        return {
            // "Abonnements": await this.getSubscriptionsVideos()
        }
    }

    async getSubscriptionsVideos()
    {
        const response = await this.apiClient.subscriptions.list({
            part: 'snippet',
            mine: true,
            maxResults: 20
        });

        return response.data.items.map(video => this.formatForCarousel(
            video.snippet.resourceId.videoId,
            video.snippet.title,
            video.snippet.thumbnails.high.url,
            video.snippet.description
        ));
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