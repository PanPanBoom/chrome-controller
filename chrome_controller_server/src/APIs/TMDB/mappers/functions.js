import { Movie } from "./Movie.js";
import { Series } from "./Series.js";
import { People } from "./People.js";

const classes = { movie: Movie, tv: Series, person: People };

export const createFromTMDB = (tmdbId, rawTMDBData, tmdbApi) => classes[tmdbId.split('/')[0]].buildData(tmdbId, rawTMDBData, tmdbApi);
export const formatForCarousel = (mediaType, rawTMDBData, tmdbApi) => classes[mediaType].formatForCarousel(rawTMDBData, tmdbApi);