import { NetflixApi } from "./NetflixApi.js";
import { YoutubeApi } from "./YoutubeApi.js";

export class ApiManager
{
    static apis = {
        youtube: new YoutubeApi(),
        netflix: new NetflixApi()
    }

    static async getTopShows(platform, filter)
    {
        return await this.apis[platform].getTopShows(filter);
    }
}