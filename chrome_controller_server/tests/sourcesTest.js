import { TMDBApi } from "../src/APIs/TMDB/TMDBApi.js";
import { MappleTVSource } from "../src/source/MappleTVSource.js";
import { MovixSource } from "../src/source/MovixSource.js";
import { NakastreamSource } from "../src/source/NakastreamSource.js";
import { NoxpulseSource } from "../src/source/NoxpulseSource.js";
import { NakanimeSource } from "../src/source/NakanimeSource.js";

const fightClubId = 'movie/550';

const sources = [
    new NakastreamSource(),
    new MovixSource(),
    new NoxpulseSource(),
    new MappleTVSource()
];

const testSource = async (source, showId) => {
    const availability = await source.checkShowAvailability(showId);
    const videoInfo = await source.getShowVideoInfo(showId);
    
    console.log('Source: ', source.baseUrl);
    console.log('Show availabilty: ', availability);
    console.log('Video url: ', JSON.stringify(videoInfo));
    console.log('\n');

    return;
}

console.log('Testing with Fight Club\n');

for(const source of sources)
{
    await testSource(source, fightClubId);
}

const narutoId = 'tv/46260';

const animeSource = new NakanimeSource(new TMDBApi());
testSource(animeSource, narutoId);