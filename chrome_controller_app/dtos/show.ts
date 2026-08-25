export type ShowDTO = {
    id: string;
    title: string;
    img: string;
    link: string;
    overview: string;
    media_type: string;
    platform: string;
};

export type MovieDTO = ShowDTO & {
    genres: string[];
    release_date: string;
    runtime: number;
    vote_average: number;
    cast: {
        name: string;
        character: string;
        img: string;
    }[];
    director: string;
    platforms: {
        name: string;
        img: string;
    }[];
    trailer: string;
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
    episode_count: number;
    season_number: number;
    vote_average: number;
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
}