import { Show } from "./Show.js";

export class Movie extends Show
{
    constructor()
    {
        super();
        this.mediaType = 'movie';
    }

    details(movie, collection = null, similars = null)
    {
        const data = super.details(movie, collection, similars);
        
        return {
            ...data,
            runtime: movie.runtime
        };
    }

    getReleaseDate(movie)
    {
        return movie.release_date;
    }

    getTitle(movie)
    {
        return movie.title;
    }

    getDirectors(movie)
    {
        return movie?.credits?.crew?.filter(crewMember => crewMember.job === "Director");
    }
}