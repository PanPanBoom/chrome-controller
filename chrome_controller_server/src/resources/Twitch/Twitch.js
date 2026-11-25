import { serverLog } from "../../utils.js";
import { Resource } from "../Resource.js";
import { TwitchApi } from "./TwitchApi.js";
import { TwitchMapper } from "./TwitchMapper.js";

export class Twitch extends Resource
{
    constructor()
    {
        super(new TwitchApi(), new TwitchMapper());
    }

    async sendTopShowsRequest(filter)
    {
        return this.api.getTopShows(filter)
            .then(response => response.data.map(stream => this.mapper.carousel(stream)));
    }

    async searchShowsByTitle(title)
    {
        return this.api.searchShowsByTitle(title)
            .then(response => Promise.all(response.data.map(async (channel) => {
                const user = await channel.getUser();
                const stream = await user.getStream();
                
                return this.mapper.carousel(stream);
            })));
    }

    async sendListsRequest(filter)
    {
        return {}
    }

    getShowLink(id)
    {
        return `https://www.twitch.tv/${id}`;
    }

    getShowIntent(id)
    {
        return `smarttvtwitch://data/LIVE/${id}`;
    }
}