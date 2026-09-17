export type ShowDTO = {
    id: string;
    title: string;
    img: string;
    overview: string;
    media_type: string;
    platform: string;
    nextStartTime?: number;
    currentEpisodeInfo?: {
        season: number;
        episode: number; 
    },
    percentageWatched?: number;
};

export type CastDTO = {
    id: number;
    name: string;
    character: string;
    img: string;
}[];

export type MovieDTO = ShowDTO & {
    genres: string[];
    release_date: string;
    runtime: number;
    vote_average: number;
    cast: CastDTO;
    director: string;
    platforms: {
        id: number;
        name: string;
        img: string;
    }[];
    trailer: string;
    collection: ShowDTO[];
};

export type SeriesDTO = MovieDTO & {
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