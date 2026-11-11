import { dateParser, serverLog } from "../../../utils.js";
import { Movie } from "./Movie.js";
import { Series } from "./Series.js";

const translations = {
    "Acting": "Acteur",
    "Directing": "Réalisateur",
    "Writing": "Scénariste",
}

const showClasses = { movie: Movie, tv: Series };

export class People
{
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const mediaType = tmdbId.split('/')[0];

        const actor = rawTMDBData?.known_for_department === 'Acting';

        const mainShows = actor ? 
            rawTMDBData?.combined_credits?.cast
                ?.filter(show => !show?.genre_ids?.some((g) => [10767, 10764, 10763].includes(g)))
                ?.filter(show => (show.order ?? 0) <= 5)
            : 
            rawTMDBData?.combined_credits?.crew
                ?.filter(show => rawTMDBData?.known_for_department === show?.department)
                ?.filter(show => !show?.genre_ids?.some((g) => [10767, 10764, 10763].includes(g)));
        
        mainShows?.sort((a, b) => b.vote_count - a.vote_count);

        return {
            id: tmdbId,
            img: tmdbApi.imageBaseUrl + rawTMDBData.profile_path,
            title: rawTMDBData.name,
            overview: rawTMDBData.biography,
            media_type: mediaType,
            birth_date: dateParser(rawTMDBData.birthday),
            profession: translations[rawTMDBData?.known_for_department] || rawTMDBData?.known_for_department,
            shows: await Promise.all(mainShows?.map(async (show) => await showClasses[show.media_type].formatForCarousel(show, tmdbApi)))
        }
    }
    
    static async formatForCarousel(rawTMDBData, tmdbApi)
    {
        return tmdbApi.formatForCarousel(
            `person/${rawTMDBData.id}`,
            rawTMDBData.name,
            tmdbApi.imageBaseUrl + rawTMDBData.profile_path,
            rawTMDBData.overview,
            'person'
        )
    }

    static async buildFilmography(rawTMDBData, tmdbApi)
    {
        let showsByYear = {'Divers': []};
        rawTMDBData.forEach(show => {
            let year = (show.release_date ?? show.first_credit_air_date)?.slice(0, 4) ?? 'Divers';
            if(year.length === 0)
                year = 'Divers';

            if(Object.keys(showsByYear).includes(year))
                showsByYear[year].push(show)
            else
                showsByYear[year] = [show];
        });

        return Object.fromEntries(
            await Promise.all(
                Object.entries(showsByYear).map(async ([year, shows]) => [
                    year,
                    await Promise.all(
                        [...shows]
                            .filter(show => show?.genre_ids?.length > 0 && !show?.genre_ids?.some((g) => [10767, 10764, 10763].includes(g)))
                            .sort((a, b) => new Date(a.release_date ?? a.first_credit_air_date) - new Date(b.release_date ?? b.first_credit_air_date))
                            .map(show => showClasses[show.media_type].formatForCarousel(show, tmdbApi))
                    )
                ])
            )
        );
    }
}