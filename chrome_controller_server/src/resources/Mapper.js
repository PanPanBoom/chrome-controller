export class Mapper
{
    constructor()
    {
        this.platform = "";
    }

    carousel(id, title, img, overview, media_type)
    {
        return {
            id,
            title,
            img,
            overview,
            media_type,
            platform: this.platform
        };
    }

    list(id, title, img, releaseDate, info, relevance, media_type)
    {
        return {
            id,
            title,
            img,
            releaseDate,
            info,
            relevance,
            media_type,
            platform: this.platform
        };
    }
}