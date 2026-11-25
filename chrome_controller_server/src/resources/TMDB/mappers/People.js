import { dateParser, serverLog } from "../../../utils.js";
import { Movie } from "./Movie.js";
import { Series } from "./Series.js";
import { TMDBMapper } from "./TMDBMapper.js";

const translations = {
    "Acting": "Acteur",
    "Directing": "Réalisateur",
    "Writing": "Scénariste",
}

const showClasses = { movie: Movie, tv: Series };
export const excludedGenreIds = [10767, 10764, 10763, 99];

export class People extends TMDBMapper
{
    constructor()
    {
        super();
        this.mediaType = 'person';
    }

    details(person, shows)
    {
        return {
            ...super.details(person),
            biography: person.biography,
            birth_date: dateParser(person.birthday),
            profession: translations[person?.known_for_department] || person?.known_for_department,
            shows,
            hasFilmography: person?.combined_credits?.cast?.filter(show => this.isShowInFilmography(show))?.length > 0,
            hasProductions: person?.combined_credits?.crew?.length > 0
        }
    }

    getTitle(person)
    {
        return person.name;
    }

    getPosterPath(person)
    {
        return person.profile_path && (this.imageBaseUrl + person.profile_path);
    }

    isShowInFilmography(rawShowData)
    {
        return rawShowData?.genre_ids?.length > 0 && !rawShowData?.genre_ids?.some((g) => excludedGenreIds.includes(g))
    }
    
    carousel(person)
    {
        return super.carousel(
            `${this.mediaType}/${person.id}`,
            person.name,
            this.getPosterPath(person),
            person.overview,
            this.mediaType
        )
    }
}