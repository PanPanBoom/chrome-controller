import { dateParser, serverLog } from "../../../utils.js";
import { Movie } from "./Movie.js";
import { Series } from "./Series.js";

const translations = {
    "Acting": "Acteur",
    "Directing": "Réalisateur",
    "Writing": "Scénariste",
}

const showClasses = { movie: Movie, tv: Series };
const excludedGenreIds = [10767, 10764, 10763, 99];

export class People
{
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        const mediaType = tmdbId.split('/')[0];

        const actor = rawTMDBData?.known_for_department === 'Acting';

        const mainShows = actor ? 
            rawTMDBData?.combined_credits?.cast
                ?.filter(show => !show?.genre_ids?.some((g) => excludedGenreIds.includes(g)))
                ?.filter(show => (show.order ?? 0) <= 5)
            : 
            rawTMDBData?.combined_credits?.crew
                ?.filter(show => rawTMDBData?.known_for_department === show?.department)
                ?.filter(show => !show?.genre_ids?.some((g) => excludedGenreIds.includes(g)));
        
        mainShows?.sort((a, b) => b.vote_count - a.vote_count);

        return {
            id: tmdbId,
            img: rawTMDBData.profile_path && (tmdbApi.imageBaseUrl + rawTMDBData.profile_path),
            title: rawTMDBData.name,
            biography: rawTMDBData.biography,
            media_type: mediaType,
            birth_date: dateParser(rawTMDBData.birthday),
            profession: translations[rawTMDBData?.known_for_department] || rawTMDBData?.known_for_department,
            shows: await Promise.all(mainShows?.map(async (show) => await showClasses[show.media_type].formatForCarousel(show, tmdbApi))),
            hasFilmography: rawTMDBData?.combined_credits?.cast?.filter(show => this.isShowInFilmography(show))?.length > 0,
            hasProductions: rawTMDBData?.combined_credits?.crew?.length > 0
        }
    }

    static isShowInFilmography(rawShowData)
    {
        return rawShowData?.genre_ids?.length > 0 && !rawShowData?.genre_ids?.some((g) => excludedGenreIds.includes(g))
    }
    
    static async formatForCarousel(rawTMDBData, tmdbApi)
    {
        return tmdbApi.formatForCarousel(
            `person/${rawTMDBData.id}`,
            rawTMDBData.name,
            rawTMDBData.profile_path && (tmdbApi.imageBaseUrl + rawTMDBData.profile_path),
            rawTMDBData.overview,
            'person'
        )
    }

    static async buildFilmography(rawTMDBData, tmdbApi)
    {
        const uniqueShowsMap = new Map();

        rawTMDBData
            .filter(show => this.isShowInFilmography(show))
            .forEach(show => {
                if (uniqueShowsMap.has(show.id))
                {
                    const existing = uniqueShowsMap.get(show.id);

                    if (show.character && existing.character)
                    {
                        const characters = existing.character.split(', ');
                        if (!characters.includes(show.character))
                            existing.character = `${existing.character}, ${show.character}`;
                    } 
                    
                    else if (show.character && !existing.character) 
                        existing.character = show.character;
                } 
                
                else 
                    uniqueShowsMap.set(show.id, { ...show });
            });

        return await Promise.all(Array.from(uniqueShowsMap.values())
            .map(show => showClasses[show.media_type].formatForList(show, tmdbApi, show.character)));

        // let showsByYear = {'Divers': []};
        // rawTMDBData
        //     .filter(show => show?.genre_ids?.length > 0 && !show?.genre_ids?.some((g) => excludedGenreIds.includes(g)))
        //     .forEach(show => {
        //         let year = (show.release_date ?? show.first_credit_air_date)?.slice(0, 4) ?? 'Divers';
        //         if(year.length === 0)
        //             year = 'Divers';

        //         if(Object.keys(showsByYear).includes(year))
        //             showsByYear[year].push(show)
        //         else
        //             showsByYear[year] = [show];
        //     });

        // return Object.fromEntries(
        //     await Promise.all(
        //         Object.entries(showsByYear).map(async ([year, shows]) => [
        //             year,
        //             await Promise.all(
        //                 [...shows]
        //                     .sort((a, b) => new Date(a.release_date ?? a.first_credit_air_date) - new Date(b.release_date ?? b.first_credit_air_date))
        //                     .map(show => showClasses[show.media_type].formatForCarousel(show, tmdbApi))
        //             )
        //         ])
        //     )
        // );
    }

    static async buildProductions(rawTMDBData, tmdbApi)
    {
        const uniqueShowsMap = new Map();

        rawTMDBData
            .forEach(show => {
                if (uniqueShowsMap.has(show.id))
                {
                    const existing = uniqueShowsMap.get(show.id);

                    if (show.job && existing.job)
                    {
                        const jobs = existing.job.split(', ');
                        if (!jobs.includes(show.job))
                            existing.job = `${existing.job}, ${show.job}`;
                    } 
                    
                    else if (show.job && !existing.job) 
                        existing.job = show.job;
                } 
                
                else 
                    uniqueShowsMap.set(show.id, { ...show });
            });

        return await Promise.all(Array.from(uniqueShowsMap.values())
            .map(show => showClasses[show.media_type].formatForList(show, tmdbApi, show.job)));
    }
}