export class Api
{
    constructor()
    {
        this.cache = {};
        this.apiClient = null;
        this.TTL = 6 * 60 * 60 * 1000;
    }

    async getTopShows(filter)
    {
        throw new Error("Must be implemented.");
    }
}