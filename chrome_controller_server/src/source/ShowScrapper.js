import { NakastreamSource } from "./NakastreamSource.js";
import { NoxpulseSource } from "./NoxpulseSource.js";
import { MappleTVSource } from "./MappleTVSource.js";
import { MovixSource } from "./MovixSource.js";
import { NakanimeSource } from "./NakanimeSource.js";
import { serverLog } from "../utils.js";
import { state } from "../state.js";

export class ShowScrapper
{
    constructor(tmdbApi)
    {
        this.sources = [
            // new StreamoSource(),
            new NakastreamSource(),
            new MovixSource(),
            new NakanimeSource(tmdbApi),
            new NoxpulseSource(),
            new MappleTVSource(),
        ];
    }

    async checkShowAvailability(id, episodeInfo)
        {
            for (const source of this.sources)
                if (await source.checkShowAvailability(id, episodeInfo))
                    return true;
    
            return false;
        }
    
        async findAvailableSources(id, episodeInfo, onFound)
        {
            const availableSources = [];
    
            await Promise.all(this.sources.map(async (source) => {
                try
                {
                    const fetchedSources = await source.checkShowAvailability(id, episodeInfo);
                    if(fetchedSources)
                    {
                        for(const sourceNameWithLanguage of fetchedSources)
                            availableSources.push(sourceNameWithLanguage);
    
                        onFound?.();
                    }
                }
    
                catch(e)
                {
                    serverLog(`Source ${source.name} failed:`, e);
                }
            }));
    
            serverLog('Sources found');
    
            return availableSources;
        }
    
        async getShowLink(id, episodeInfo = null, sourceName = null)
        {
            for (const source of this.sources)
            {
                if(sourceName && sourceName !== source.name)
                    continue;

                if (await source.checkShowAvailability(id, episodeInfo))
                    return await source.getShowUrl(id, episodeInfo);
            }
    
            return null;
        }
    
        async getShowIntent(id, episodeInfo = null, startTime = 0, sourceName = null, audioLanguage = 'fr')
        {
            for (const source of this.sources)
            {
                if(sourceName && sourceName !== source.name)
                    continue;

                if (await source.checkShowAvailability(id, episodeInfo))
                    return this.getIntentFromSource(id, episodeInfo, startTime, source, audioLanguage);
            }
    
            return null;
        }
    
        async getIntentFromSource(id, episodeInfo = null, startTime = 0, source = null, audioLanguage = 'fr')
        {
            serverLog("Show available on " + source.baseUrl);
    
            const videoInfo = await source.getShowVideoInfo(id, episodeInfo, audioLanguage);
            serverLog(videoInfo);
    
            const params = new URLSearchParams();
    
            params.append('showId', id);
            if(episodeInfo)
                params.append('episodeInfo', encodeURIComponent(JSON.stringify(episodeInfo)));
    
            params.append('url', encodeURIComponent(videoInfo.url));
            params.append('referer', encodeURIComponent(videoInfo.referer));
            params.append('cookies', encodeURIComponent(videoInfo.cookies));
            if(videoInfo.type)
                params.append('type', videoInfo.type);
    
            params.append('userAgent', encodeURIComponent(videoInfo.userAgent));
            params.append('serverIp', encodeURIComponent(state.serverIp));
            params.append('startTime', startTime);
            params.append('audioLanguage', audioLanguage);
    
            serverLog(`Starting show at ${startTime / 1000}s`);
    
            return `chromecontroller://play?${params}`;
        }
}