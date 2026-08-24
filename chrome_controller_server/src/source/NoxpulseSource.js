import { Source } from "./Source.js";
import puppeteer from 'puppeteer';

export class NoxpulseSource extends Source
{
    constructor()
    {
        super("https://noxpulse.cc/", "watch");
    }

    getShowUrl(id, episodeInfo = null)
    {
        super.getShowUrl(id, episodeInfo);
        if(id.includes("tv"))
        {
            const realId = id.split("/")[1];
            return `${this.watchUrl}/series/${realId}/${episodeInfo ? `${episodeInfo.season}/${episodeInfo.episode}` : '1/1'}`;
        }

        else
            return `${this.watchUrl}/${id}`;

        return url;
    }

    async getShowVideoInfo(id, episodeInfo = null)
    {
        super.getShowVideoInfo(id, episodeInfo);
        const [ mediaType, realId ] = id.split("/");
        const res = await fetch(`https://api.noxpulse.cc/watch/${mediaType === "tv" ? "series" : mediaType}/${realId}${mediaType === "tv" ? `/${episodeInfo?.season ?? 1}/${episodeInfo?.episode ?? 1}` : ""}`);
        
        if(res.status !== 200)
        {
            console.log(`Error ${res.status} fetching url: ${res.statusText}`);
            return "";
        }
        
        const watchData =  await res.json();

        return {
            url: watchData.source.url,
            referer: this.baseUrl
        }
    }

    async checkShowAvailability(id, episodeInfo = null)
    {
        super.checkShowAvailability(id, episodeInfo);
        const [ mediaType, realId ] = id.split("/");

        const res = await fetch(`https://api.noxpulse.cc/watch/${mediaType === "tv" ? "series" : mediaType}/${realId}${mediaType === "tv" ? `/${episodeInfo?.season ?? 1}/${episodeInfo?.episode ?? 1}` : ""}`);
        
        return res.status == 200;
    }
}