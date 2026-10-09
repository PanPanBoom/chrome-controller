import { Source } from "./Source.js";

export class MovixSource extends Source
{
    constructor()
    {
        super('https://movix.college', '/watch');
        this.apiUrl = "https://api.movix.college/api";
    }

    async getShowUrl(id, episodeInfo = null)
    {
        super.getShowUrl(id, episodeInfo)
        return `${this.watchUrl}/${id}${id.includes("tv") ? `/s/${episodeInfo?.season ?? 1}/e/${episodeInfo?.episode ?? 1}` : ''}`;
    }

    async getShowVideoInfo(id, episodeInfo = null)
    {
        super.getShowVideoInfo(id, episodeInfo);

        const res = await fetch(`${this.apiUrl}/purstream/${id}/stream${id.includes('tv') ? `?season=${episodeInfo?.season ?? 1}&episode=${episodeInfo?.episode ?? 1}` : ''}`);
        if(res.status !== 200)
        {
            console.log(`Error ${res.status} fetching Movix purstream: ${JSON.stringify(res.body)}`);
            return { url: '' };
        }

        const showData = await res.json();

        return {
            url: showData.sources?.[0]?.url
        }
    }

    async checkShowAvailability(id, episodeInfo = null)
    {
        super.checkShowAvailability(id, episodeInfo);

        return (await this.getShowVideoInfo(id, episodeInfo)).url !== "";
    }
}