import { NetflixApi } from "./NetflixApi.js";
import { TMDBApi } from "./TMDB/TMDBApi.js";
import { TwitchApi } from "./TwitchApi.js";
import { YoutubeApi } from "./YoutubeApi.js";

export class ApiManager
{
    static apis = {
        youtube: new YoutubeApi(),
        netflix: new NetflixApi(),
        twitch: new TwitchApi(),
        tmdb: new TMDBApi()
    }

    static async getTopShows(platform, filter)
    {
        return await this.apis[platform].getTopShows(filter);
    }

    static async getLists(platform, filter)
    {
        return await this.apis[platform].getLists(filter);
    }

    static getFilters(platform)
    {
        return this.apis[platform].filters;
    }

    static async getShowByTitle(platform, title)
    {
        return await this.apis[platform].getShowByTitle(title);
    }

    static async searchShowsByTitle(platform, title, filter)
    {
        return await this.apis[platform].searchShowsByTitle(title, filter);
    }

    static async getShowById(id)
    {
        return await this.apis.tmdb.getShowById(id);
    }

    static async getSeasonById(showId, seasonNumber)
    {
        return await this.apis.tmdb.getSeasonById(showId, seasonNumber);
    }

    static async getShowLink(platform, id, episodeInfo = null)
    {
        return await this.apis[platform].getShowLink(id, episodeInfo);
    }

    static async getShowIntent(platform, id, episodeInfo = null, startTime = 0)
    {
        return await this.apis[platform].getShowIntent(id, episodeInfo, startTime);
    }
}