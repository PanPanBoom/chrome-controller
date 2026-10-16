import { MappleTVSource } from "../src/source/MappleTVSource.js";
import { MovixSource } from "../src/source/MovixSource.js";
import { NakastreamSource } from "../src/source/NakastreamSource.js";
import { NoxpulseSource } from "../src/source/NoxpulseSource.js";

const showId = 'movie/550'; // Fight Club

const sources = [
    new NakastreamSource(),
    new MovixSource(),
    new NoxpulseSource(),
    new MappleTVSource()
];

console.log('Testing with Fight Club\n');

for(const source of sources)
{
    const availability = await source.checkShowAvailability(showId);
    const videoInfo = await source.getShowVideoInfo(showId);
    
    console.log('Source: ' + source.baseUrl);
    console.log('Show availabilty: ' + availability);
    console.log('Video url: ' + JSON.stringify(videoInfo));
    console.log('\n');
}