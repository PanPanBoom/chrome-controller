import { Show } from "./Show.js";

export class Series extends Show
{
    constructor()
    {
        super();
        this.mediaType = 'tv';
    }    

    details(series, collection = null, similars = null)
    {
        const data = super.details(series, collection, similars);
        
        return {
            ...data,
            number_of_seasons: series.number_of_seasons,
            number_of_episodes: series.number_of_episodes,
            seasons: series.seasons?.map(season => ({
                id: season.id,
                season_number: season.season_number,
                name: season.name
            })) || undefined,
        };
    }

    getReleaseDate(series)
    {
        return series.first_air_date;
    }

    getTitle(series)
    {
        return series.name;
    }

    getDirectors(series)
    {
        return series.created_by;
    }
}