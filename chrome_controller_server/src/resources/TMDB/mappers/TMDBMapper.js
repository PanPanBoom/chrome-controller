import { Mapper } from "../../Mapper.js";

export class TMDBMapper extends Mapper
{
    constructor()
    {
        super();
        this.platform = "tmdb";
        this.imageBaseUrl = "https://image.tmdb.org/t/p/original";
    }

    details(show)
    {
        return {
            id: `${show.media_type}/${show.id}`,
            title: this.getTitle(show),
            img: this.getPosterPath(show),
            media_type: show.media_type
        }
    }

    getTitle(show)
    {
        return show.title;
    }

    getPosterPath(show)
    {
        return show.poster_path && (this.imageBaseUrl + show.poster_path);
    }   
}