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

    list(id, title, img, releaseDate, info, order, apparitions, vote_count, media_type)
    {
        return {
            id,
            title,
            img,
            releaseDate,
            info,
            order,
            vote_count,
            apparitions,
            media_type,
            platform: this.platform
        };
    }
}