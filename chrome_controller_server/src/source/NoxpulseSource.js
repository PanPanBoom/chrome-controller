import { language } from "googleapis/build/src/apis/language/index.js";
import { Source } from "./Source.js";

export class NoxpulseSource extends Source
{
    constructor()
    {
        super("NoxPulse", "https://noxpulse.cc/", "watch");
    }

    fetchUrl(id, episodeInfo = null)
    {
        if(id.includes("tv"))
        {
            const realId = id.split("/")[1];
            return `${this.watchUrl}/series/${realId}/${episodeInfo ? `${episodeInfo.season}/${episodeInfo.episode}` : '1/1'}`;
        }

        else
            return `${this.watchUrl}/${id}`;
    }

    async fetchVideoInfo(id, episodeInfo = null)
    {
        const [ mediaType, realId ] = id.split("/");
        const res = await fetch(`https://api.noxpulse.cc/watch/${mediaType === "tv" ? "series" : mediaType}/${realId}${mediaType === "tv" ? `/${episodeInfo?.season ?? 1}/${episodeInfo?.episode ?? 1}` : ""}`);
        
        if(res.status !== 200)
        {
            this.log(`Error ${res.status} fetching url: ${res.statusText}`);
            return "";
        }
        
        const watchData =  await res.json();

        return {
            url: watchData.source.url,
            referer: this.baseUrl,
            userAgent: this.userAgent,
            type: watchData.source.type
        }
    }

    async fetchAvailability(id, episodeInfo = null)
    {
        const [ mediaType, realId ] = id.split("/");

        const res = await fetch(`https://api.noxpulse.cc/watch/${mediaType === "tv" ? "series" : mediaType}/${realId}${mediaType === "tv" ? `/${episodeInfo?.season ?? 1}/${episodeInfo?.episode ?? 1}` : ""}`);
        
        return res.status == 200 ? 
        [{
            name: this.name,
            language: 'VF'
        }] : 
        null;
    }
}