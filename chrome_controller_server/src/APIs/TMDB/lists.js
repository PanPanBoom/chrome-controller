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
    }
}

export const specificListsFilters = {
    "movie": {
        "Blockbusters de l'année": {
            'sort_by': 'revenue.desc',
            'primary_release_year': (new Date()).getFullYear(),
            'vote_count.gte': 1000
        },
        "Sortis le mois dernier": {
            'primary_release_date.gte': new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
            'primary_release_date.lte': new Date().toISOString().split('T')[0],
            'sort_by': 'popularity.desc',
            'with_release_type': '2|3'
        }
    },
    "tv": {
        "Anime": {
            with_genres: 16,
            with_original_language: 'ja',
            sort_by: 'popularity.desc'
        },
        "Prestige HBO": {
            with_networks: 49,
            sort_by: 'popularity.desc',
            "vote_average.gte": 8
        }
    }
};