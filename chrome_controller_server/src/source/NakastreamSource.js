import { Source } from "./Source.js";
import 'dotenv/config';

export class NakastreamSource extends Source
{
    constructor()
    {
        super("https://nakastream.tv", "/player?id=");
    }

    async login()
    {
        if(!this.headers)
        {
            console.log("Logging in...");

            const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: process.env.NAKASTREAM_MAIL, password: process.env.NAKASTREAM_PASSWORD})
            });

            if(res.status !== 200)
            {
                console.log(`Error ${res.status} while login: ${res.statusText}`);
                return false;
            }

            const data = await res.json();

            this.headers = {
                accept: 'application/json',
                Authorization: `Bearer ${data.token}`
            };

            return true;
        }

        return true;
    }

    async getNakaId(id)
    {
        await this.login();

        console.log("Fetching nakastream id...");

        const showRes = await fetch(`${this.baseUrl}/api/v1/browse/by-tmdb/${id}`, {
            method: 'GET',
            headers: this.headers
        });

        if(showRes.status !== 200)
        {
            console.log(`Error ${showRes.status} fetching id: ${showRes.statusText}`);
            return "";
        }

        const showData = await showRes.json();

        console.log("Nakastream id: " + showData.id);

        return showData.id;
    }

    async getShowUrl(id, episodeInfo = null)
    {
        super.getShowUrl(id, episodeInfo);
        return `${this.watchUrl}${await this.getNakaId(id)}${id.includes('tv') ? `&season=${episodeInfo?.season ?? 1}&episode=${episodeInfo?.episode ?? 1}` : ""}`;
    }

    async getShowVideoInfo(id, episodeInfo)
    {
        super.getShowVideoInfo(id, episodeInfo);
        const nakaId = await this.getNakaId(id);

        console.log("Fetching nakastream source...");

        const resSource = await fetch(`${this.baseUrl}/api/v1/streaming/source/${nakaId}${id.includes("tv") ? `?season=${episodeInfo?.season ?? 1}&episode=${episodeInfo?.episode ?? 1}` : ""}`, {
            method: 'GET',
            headers: this.headers
        });

        if(resSource.status !== 200)
        {
            console.log(`Error ${resSource.status} fetching video source: ${resSource.statusText}`);
            return "";
        }

        const source = await resSource.json();

        const videoUrl = this.baseUrl + source.url;

        console.log('Source nakastream: ' + videoUrl);

        return {
            url: videoUrl,
            referer: ""
        }
    }

    async checkShowAvailability(id, episodeInfo = null)
    {
        super.checkShowAvailability(id, episodeInfo);
        await this.login();

        const [ mediaType, realId ] = id.split("/");

        const res = await fetch(`${this.baseUrl}/api/v1/streaming/check/${realId}?type=${mediaType}`, {
            method: 'GET',
            headers: this.headers
        });
        
        const availabilty = await res.json();

        console.log(availabilty);

        return availabilty.available;
    }
}