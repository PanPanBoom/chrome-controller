import { NetflixApi } from "./NetflixApi.js";
import { TwitchApi } from "./TwitchApi.js";
import { YoutubeApi } from "./YoutubeApi.js";

export class ApiManager
{
    static apis = {
        youtube: new YoutubeApi(),
        netflix: new NetflixApi(),
        twitch: new TwitchApi()
    }

    static async getTopShows(platform, filter)
    {
        return await this.apis[platform].getTopShows(filter);
    }

    static getFilters(platform)
    {
        return this.apis[platform].filters;
    }
}