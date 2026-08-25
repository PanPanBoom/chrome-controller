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

        return response.data.items.map(video => ({
            id: video.id,
            title: video.snippet.title,
            img: video.snippet.thumbnails.high.url,
            overview: video.snippet.description,
            platform: this.platform
        }));
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