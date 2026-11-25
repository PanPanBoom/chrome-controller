import { Resource } from "../Resource.js";
import { NetflixApi } from "./NetflixApi.js";
import { NetflixMapper } from "./NetflixMapper.js"

export class Netflix extends Resource
{
    constructor()
    {
        super(new NetflixApi(), new NetflixMapper());
        this.filters = [
            {
                displayText: "Tout",
                apiValue: ""
            },
            {
                displayText: "Séries",
                apiValue: "series"
            },
            {
                displayText: "Films",
                apiValue: "movie"
            }
        ];
    }

    searchShowsByTitle(title, filter)
    {
        return this.api.searchShowsByTitle(title, filter)
            .then(result => result.shows.map(show => this.mapper.carousel(show)))
    }

    async sendListsRequest(filter)
    {
        return {}
    }

    async getShowByTitle(title)
    {
        const shows = await this.searchShowsByTitle(title);

        return shows.find(show => show.title === title) || shows[0];
    }

    async getShowLink(id)
    {
        const show = await this.api.getShowById(id);

       return show.streamingOptions.fr.find(streamingOption => streamingOption.service.id === this.platform).videoLink;
    }

    async getShowIntent(id)
    {
        return await this.getShowLink(id);
    }
}