import { Source } from "./Source.js";

export class MovixSource extends Source
{
    constructor()
    {
        super('Movix', 'https://movix.dog', '/watch');
        this.apiUrl = "https://api.movix.dog/api";
    }

    async fetchUrl(id, episodeInfo = null)
    {
        return `${this.watchUrl}/${id}${id.includes("tv") ? `/s/${episodeInfo?.season ?? 1}/e/${episodeInfo?.episode ?? 1}` : ''}`;
    }

    async fetchSource(id, episodeInfo)
    {
        const res = await fetch(`${this.apiUrl}/purstream/${id}/stream${id.includes('tv') ? `?season=${episodeInfo?.season ?? 1}&episode=${episodeInfo?.episode ?? 1}` : ''}`);
        if(res.status !== 200)
        {
            this.log(`Error ${res.status} fetching Movix purstream: ${JSON.stringify(res.body)}`);
            return null;
        }

        const showData = await res.json();

        return showData.sources[0];
    }

    async fetchVideoInfo(id, episodeInfo = null)
    {
        const source = await this.fetchSource(id, episodeInfo);

        return {
            url: source ? source.url : ''
        }
    }

    async fetchAvailability(id, episodeInfo = null)
    {
        const source = await this.fetchSource(id, episodeInfo);

        return source ?
            [{
                name: this.name,
                language: source.name.split('| ')[2]
            }] :
            null;
    }
}