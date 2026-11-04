type BaseDTO = {
    id: string;
    title: string;
    img: string;
    overview: string;
}

export type ShowDTO = BaseDTO & {
    media_type: 'movie' | 'tv';
    platform: string;
    nextStartTime?: number;
    currentEpisodeInfo?: {
        season: number;
        episode: number; 
    },
    percentageWatched?: number;
};

export type CastDTO = {
    id: string;
    name: string;
    character: string;
    img: string;
}[];

export type MovieDTO = ShowDTO & {
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
    collection: ShowDTO[];
    similars: ShowDTO[];
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

export type SeasonDTO = ShowDTO & {
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
    birth_date: string;
    media_type: 'person';
    profession: string;
    shows: ShowDTO[];
}