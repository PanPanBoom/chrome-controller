import { TMDBApi } from "../src/APIs/TMDB/TMDBApi.js";
import { MappleTVSource } from "../src/source/MappleTVSource.js";
import { MovixSource } from "../src/source/MovixSource.js";
import { NakastreamSource } from "../src/source/NakastreamSource.js";
import { NoxpulseSource } from "../src/source/NoxpulseSource.js";
import { NakanimeSource } from "../src/source/NakanimeSource.js";
import { MovieWebSource } from "../src/source/MovieWebSource.js";
import { serverLog } from '../src/utils.js'

const fightClubId = 'movie/550';

const sources = [
    new NakastreamSource(),
    new MovixSource(),
    new NoxpulseSource(),
    new MappleTVSource(),
    new MovieWebSource()
];

const testSource = async (source, showId) => {
    const availability = await source.checkShowAvailability(showId);
    const videoInfo = await source.getShowVideoInfo(showId);
    
    serverLog('Source: ', source.baseUrl);
    serverLog('Show availabilty: ', availability);
    serverLog('Video url: ', JSON.stringify(videoInfo));
    serverLog('\n');

    return;
}

serverLog('Testing with Fight Club\n');

for(const source of sources)
{
    await testSource(source, fightClubId);
}

// const narutoId = 'tv/46260';

// const animeSource = new NakanimeSource(new TMDBApi());
// testSource(animeSource, narutoId);