import { Netflix } from "./Netflix/Netflix.js";
import { TMDB } from "./TMDB/TMDB.js";
import { Youtube } from "./Youtube/Youtube.js";
import { Twitch } from "./Twitch/Twitch.js";

export class ResourceManager
{
    static resources = {
        youtube: new Youtube(),
        netflix: new Netflix(),
        twitch: new Twitch(),
        tmdb: new TMDB()
    }

    static async getTopShows(platform, filter)
    {
        return await this.resources[platform].getTopShows(filter);
    }

    static async getLists(platform, filter)
    {
        return await this.resources[platform].getLists(filter);
    }

    static getFilters(platform)
    {
        return this.resources[platform].filters;
    }

    static async getShowByTitle(platform, title)
    {
        return await this.resources[platform].getShowByTitle(title);
    }

    static async searchShowsByTitle(platform, title, filter)
    {
        return await this.resources[platform].searchShowsByTitle(title, filter);
    }

    // static async getShowById(id)
    // {
    //     return await this.resources.tmdb.getShowById(id);
    // }

    // static async getSeasonById(showId, seasonNumber)
    // {
    //     return await this.resources.tmdb.getSeasonById(showId, seasonNumber);
    // }

    static async getShowLink(platform, id, episodeInfo = null, source = null)
    {
        return await this.resources[platform].getShowLink(id, episodeInfo, source);
    }

    static async getShowIntent(platform, id, episodeInfo = null, startTime = 0, source = null, audioLanguage = 'fr')
    {
        return await this.resources[platform].getShowIntent(id, episodeInfo, startTime, source, audioLanguage);
    }
}