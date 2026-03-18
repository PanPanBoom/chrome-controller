import { Api } from "./Api.js";
import 'dotenv/config';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api'

export class TwitchApi extends Api
{
    constructor()
    {
        super();
        const authProvider = new AppTokenAuthProvider(process.env.TWITCH_API_ID, process.env.TWITCH_API_SECRET);
        this.apiClient = new ApiClient({ authProvider });
    }

    async getTopShows(filter)
    {
        const now = Date.now();

        if(this.cache.data && (now - this.cache.lastFetch) < this.TTL) return this.cache.data;

        const response = await this.apiClient.streams.getStreams({
            language: 'fr',
            limit: 20
        });

        this.cache.data = response.data.map(stream => ({
            title: stream.title,
            img: stream.getThumbnailUrl(1280, 720),
            link: `https://www.twitch.tv/${stream.userName}`,
            overview: stream.userDisplayName
        }));
        this.cache.lastFetch = now;

        return this.cache.data;
    }
}