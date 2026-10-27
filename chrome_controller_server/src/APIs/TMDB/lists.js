import { getLastMonthRange, toYMD, addDays } from "../../utils.js";

export const baseListsFilters = {
    "Pépites méconnues": {
        'sort_by': 'vote_average.desc',
        'vote_count.gte': 200,
        'vote_count.lte': 1500,
        'vote_average.gte': 7.5
    },
    'Feel Good': {
        with_genres: 35,
        sort_by: 'popularity.desc',
        without_genres: '18,27,53,99',
        "vote_average.gte": 6.5
    },
    'Le caaaaatch': {
        'with_genres': 18,
        'sort_by': 'popularity.desc',
        'with_keywords': 206441
    },
    'Casse-tête & Stratégie': {
        // 'with_genres': '53,9648',
        'with_keywords': '316|2157',
        'vote_count.gte': 1000,
        'sort_by': 'popularity.desc'
    }
}

const { start, end } = getLastMonthRange();
const today = new Date();

export const specificListsFilters = {
    "movie": {
        "Actuellement au cinéma": {
            'include_adult': false,
            'include_video': false,
            'sort_by': 'popularity.desc',
            'with_release_type': '2|3',
            'release_date.gte': toYMD(addDays(today, -44)),
            'release_date.lte': toYMD(addDays(today, 1)),
            'region': 'FR'
        },
        "Blockbusters de l'année": {
            'sort_by': 'revenue.desc',
            'primary_release_year': today.getFullYear(),
            'vote_count.gte': 1000
        },
        "Sortis le mois dernier": {
            'primary_release_date.gte': toYMD(start),
            'primary_release_date.lte': toYMD(end),
            'sort_by': 'popularity.desc',
            'with_release_type': '2|3'
        },
        "Classiques du cinéma": {
            'sort_by': 'vote_average.desc',
            'vote_count.gte': 10000,
            'without_genres': '99,10755'
        }
    },
    "tv": {
        "Nouvel épisode aujourd'hui": {
            'include_adult': false,
            'sort_by': 'popularity.desc',
            'air_date.lte': toYMD(today),
            'air_date.gte': toYMD(today),
            'without_genres': '10767,10763,10764,10766'
        },
        "En cours de diffusion": {
            'include_adult': false,
            'sort_by': 'popularity.desc',
            'air_date.lte': toYMD(addDays(today, 7)),
            'air_date.gte': toYMD(today),
            'without_genres': '10767,10763,10764,10766'
        },
        "Anime": {
            with_genres: 16,
            with_original_language: 'ja',
            sort_by: 'popularity.desc'
        },
        "Prestige HBO": {
            with_networks: 49,
            sort_by: 'popularity.desc',
            "vote_average.gte": 8
        },
        'Classiques de la télé': {
            'sort_by': 'vote_average.desc',
            'vote_count.gte': 2800,
            'without_genres': '16,99,10767,10763',
            'with_original_language': 'en'
        },
        'Formats courts': {
            'with_genres': 35,
            'without_genres': '18,10759,16,10767',
            'vote_count.gte': 1500,
            'with_original_language': 'en',
            'sort_by': 'popularity.desc'
        }
    }
};