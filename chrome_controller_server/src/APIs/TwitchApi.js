import { Api } from "./Api.js";
import 'dotenv/config';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api'

export class TwitchApi extends Api
{
    constructor()
    {
        super();
        this.platform = "twitch";
        const authProvider = new AppTokenAuthProvider(process.env.TWITCH_API_ID, process.env.TWITCH_API_SECRET);
        this.apiClient = new ApiClient({ authProvider });
        this.TTL = 30 * 60 * 1000;
    }

    async sendTopShowsRequest(filter)
    {
        const response = await this.apiClient.streams.getStreams({
            language: 'fr',
            limit: 20
        });

        return response.data.map(stream => ({
            id: stream.userName,
            title: stream.userDisplayName,
            img: stream.getThumbnailUrl(1280, 720),
            overview: stream.title,
            platform: this.platform
        }));
    }

    getShowLink(id)
    {
        return `https://www.twitch.tv/${id}`;
    }
}