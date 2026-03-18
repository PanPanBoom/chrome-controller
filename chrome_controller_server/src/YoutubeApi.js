import { Api } from "./Api.js";
import 'dotenv/config';
import { google } from 'googleapis';

export class YoutubeApi extends Api
{
    constructor()
    {
        super();
        this.apiClient = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY
        });
    }

    async getTopShows(filter)
    {
        const now = Date.now();

        if(this.cache.data && (now - this.cache.lastFetch) < this.TTL) return this.cache.data;

        const response = await this.apiClient.videos.list({
            chart: 'mostPopular',
            hl:'fr_FR',
            part:'snippet',
            regionCode: 'fr',
            maxResults: 20
        });

        this.cache.data = response.data.items.map(video => ({
            title: video.snippet.title,
            img: video.snippet.thumbnails.high.url,
            link: `https://www.youtube.com/tv/watch?v=${video.id}`,
            overview: video.snippet.description
        }));
        this.cache.lastFetch = now;

        return this.cache.data;
    }
}