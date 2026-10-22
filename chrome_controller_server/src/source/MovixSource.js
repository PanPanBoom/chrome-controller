import { Source } from "./Source.js";

export class MovixSource extends Source
{
    constructor()
    {
        super('Movix', 'https://movix.dog', '/watch');
        this.apiUrl = "https://api.movix.dog/api";
    }

    async getShowUrl(id, episodeInfo = null)
    {
        super.getShowUrl(id, episodeInfo)
        return `${this.watchUrl}/${id}${id.includes("tv") ? `/s/${episodeInfo?.season ?? 1}/e/${episodeInfo?.episode ?? 1}` : ''}`;
    }

    async fetchSource(id, episodeInfo)
    {
        const res = await fetch(`${this.apiUrl}/purstream/${id}/stream${id.includes('tv') ? `?season=${episodeInfo?.season ?? 1}&episode=${episodeInfo?.episode ?? 1}` : ''}`);
        if(res.status !== 200)
        {
            console.log(`Error ${res.status} fetching Movix purstream: ${JSON.stringify(res.body)}`);
            return null;
        }

        const showData = await res.json();

        return showData.sources[0];
    }

    async getShowVideoInfo(id, episodeInfo = null)
    {
        super.getShowVideoInfo(id, episodeInfo);

        const source = await this.fetchSource(id, episodeInfo);

        return {
            url: source ? source.url : ''
        }
    }

    async checkShowAvailability(id, episodeInfo = null)
    {
        super.checkShowAvailability(id, episodeInfo);

        console.log(source);

        return source ?
            [{
                name: this.name,
                language: source.name.split('| ')[2]
            }] :
            null;
    }
}