import { Resource } from "../Resource.js";
import { YoutubeApi } from "./YoutubeApi.js";
import { YoutubeMapper } from "./YoutubeMapper.js";

export class Youtube extends Resource
{
    constructor()
    {
        super(new YoutubeApi(), new YoutubeMapper());
    }

    sendTopShowsRequest(filter)
    {
        return this.api.getTopShows(filter)
                .then(shows => shows.data.items.map(show => this.mapper.carousel(show)))
    }

    searchShowsByTitle(title, filter)
    {
        return this.api.searchShowsByTitle(title, filter)
            .then(shows => shows.data.items.map(show => this.mapper.carousel(show)))
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