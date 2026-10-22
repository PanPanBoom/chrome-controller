import { Source } from "./Source.js";

export class StreamoSource extends Source
{
    constructor()
    {
        super("https://streamotv.org", "/watch");
    }

    getShowUrl(id, episodeInfo = null)
    {
        const [mediaType, realId] = id.split('/');

        return `${this.watchUrl}/${realId}?type=${mediaType}`;
    }

    async getShowVideoInfo(id, episodeInfo = null)
    {
        console.log('Fetching token...');
        const tokenRes = await fetch(`https://streamotv.org/api/kenma-token?server=${encodeURIComponent("https://streamo.zentlify.qzz.io")}`, {
                method: 'GET',
                headers: {
                    Referer: this.getShowUrl(id, episodeInfo)
                }
            });
        if(tokenRes.status !== 200)
        {
            console.log(`Error ${tokenRes.status} while fetching token: ${tokenRes.statusText}`);
            return { url: '' };
        }

        const token = await tokenRes.json();

        console.log('Fetching sources...');

        const urlRes = await fetch(`https://streamo.zentlify.qzz.io/api/streams/daydream/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.token}`
            }
        })

        if(urlRes.status !== 200)
        {
            console.log(`Error ${urlRes.status} while fetching sources: ${urlRes.statusText}`, {
                method: 'GET'
            });
            return { url: '' };
        }

        const sources = await urlRes.json();
        
        return { url: '' };
    }

    checkShowAvailability(id, episodeInfo = null)
    {
        return true;
    }
}