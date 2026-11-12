type BaseDTO = {
    id: string;
    title: string;
    img: string;
    platform: string;
    media_type: 'movie' | 'tv' | 'person';
}

export type ShowCarouselDTO = BaseDTO & {
    overview: string;
    nextStartTime?: number;
    currentEpisodeInfo?: {
        season: number;
        episode: number; 
    },
    percentageWatched?: number;
};

export type ShowListDTO = BaseDTO & {
    releaseYear: number;
    info: string;
    order: number;
    vote_count: number;
}

export type CastDTO = {
    id: string;
    name: string;
    character: string;
    img: string;
}[];

export type MovieDTO = ShowCarouselDTO & {
    media_type: 'movie';
    genres: string[];
    release_date: string;
    runtime: number;
    vote_average: number;
    vote_count: number;
    cast: CastDTO;
    directors: CastDTO;
    platforms: {
        id: number;
        name: string;
        img: string;
    }[];
    trailer: string;
    collection: ShowCarouselDTO[];
    similars: ShowCarouselDTO[];
};

export type SeriesDTO = Omit<MovieDTO, 'media_type'> & {
    media_type: 'tv';
    number_of_seasons: number;
    number_of_episodes: number;
    seasons: {
        id: number;
        name: string;
        img: string;
        overview: string;
        episode_count: number;
        season_number: number;
        vote_average: number;
    }[];
};

export type SeasonDTO = ShowCarouselDTO & {
    season_number: number;
    vote_average: number;
    air_date: string;
    poster_path: string;
    cast: CastDTO;
    episodes: {
        id: number;
        title: string;
        overview: string;
        img: string;
        air_date: string;
        episode_number: number;
        runtime: number;
        season_number: number;
    }[]
};

export type ShowReviewDTO = {
    id: number;
    author: {
        name: string;
        username: string;
        avatar: string;
    };
    content: string;
    date: string;
    rating: number;
}

export type PeopleDTO = BaseDTO & {
    biography: string;
    birth_date: string;
    media_type: 'person';
    profession: string;
    shows: ShowCarouselDTO[];
    hasFilmography: boolean;
    hasProductions: boolean;
}