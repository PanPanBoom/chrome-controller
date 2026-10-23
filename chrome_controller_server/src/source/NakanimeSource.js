import { Source } from "./Source.js";
import { ScrappingBrowser } from "../ScrappingBrowser.js";
import { execSync } from 'child_process';

function generateXorKey(url) {
    const salt = "nkapiv1";
    const K = salt + url;
    const key = new Uint8Array(32); // Utilisation propre d'un TypedArray

    for (let M = 0; M < 32; M++) {
        let y = 0;
        for (let G = 0; G < K.length; G++) {
            // Logique de hachage : (y * 31 + ascii(char) + index) & 255
            y = (y * 31 + K.charCodeAt(G) + M) & 255;
        }
        key[M] = y;
    }
    
    return key;
}

function decryptPayload(arrayBuffer, url) {
    const data = new Uint8Array(arrayBuffer);
    const key = generateXorKey(url);

    // XOR bit à bit sur tout le fichier
    for (let i = 0; i < data.length; i++) {
        data[i] = data[i] ^ key[i % key.length];
    }

    // Conversion des octets déchiffrés en texte JSON
    const jsonText = new TextDecoder().decode(data);
    
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        throw new Error("Échec du déchiffrement : Le résultat n'est pas un JSON valide.");
    }
}

export class NakanimeSource extends Source
{
    constructor(tmdbApi)
    {
        super('Nakanime', "https://nakanime.tv", "/anime");
        this.TTL = 72 * 60 * 60 * 1000; // 3 days
        this.tmdbApi = tmdbApi;
    }

    async fetchAndDecryptAPI(endpointUrl, fetchOptions)
    {
        this.log(`Récupération de : ${endpointUrl}`);
        
        const response = await fetch(`${this.baseUrl}${endpointUrl}`, fetchOptions);

        if (!response.ok) {
            throw new Error(`Erreur réseau: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        this.log(arrayBuffer.byteLength, response.headers.get('content-encoding'));

        const data = decryptPayload(arrayBuffer, endpointUrl);
        
        this.log("JSON déchiffré avec succès !");
        return data;
    }

    async getAnimeData(nakaId)
    {
        if(nakaId === this.lastNakaId && this.lastAnimeData)
            return this.lastAnimeData;

        try
        {
            const page = await ScrappingBrowser.getNewPage();
            await page.goto(`${this.baseUrl}/anime/${nakaId}`);
            await page.waitForTimeout(5000);

            const json = await page.locator('script#anime-data').textContent();
            const data = JSON.parse(json);

            this.lastAnimeData = data.anime;

            await page.close();
            
            return this.lastAnimeData;
        }

        catch(e)
        {
            this.log(e);
        }
    }

    async getNakaId(tmdbId)
    {
        if(tmdbId === this.tmdbId && this.lastNakaId)
            return this.lastNakaId;

        this.lastTmdbId = tmdbId;

        console.log(this.tmdbApi);

        const tmdbInfos = await this.tmdbApi.getShowById(tmdbId);

        const params = new URLSearchParams();
        params.append('q', tmdbInfos.title);
        params.append('sort', 'relevance');
        params.append('page', 1);
        params.append('per_page', 32);

        const res = await this.fetchAndDecryptAPI(`/api/catalog/search?${params}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        const nakaShow = res.data.find(show => [
            Number(show.season_year) === Number(tmdbInfos.release_date.split('/')[2]),
            show.genres.length === tmdbInfos.genres.length && [...show.genres].sort().join() === [...tmdbInfos.genres].sort().join(),
            show.poster_url.split('w500/')[1] === tmdbInfos.img.split('original/')[1],
            show.overview === tmdbInfos.overview,
            show.title === tmdbInfos.title
        ].filter(Boolean).length >= 3);

        this.lastNakaId = nakaShow?.id ?? -1;

        return this.lastNakaId;
    }

    async fetchUrl(id, episodeInfo = null)
    {
        const nakaId = await this.getNakaId(id);
        
        return `${this.watchUrl}/${nakaId}/${id.includes('tv') ? `season/${episodeInfo?.season ?? 1}/episode/${episodeInfo?.episode ?? 1}` : 'watch'}`;
    }

    async getEpisodeNakaId(nakaId, episodeInfo)
    {
        const nakaShow = await this.getAnimeData(nakaId);

        if(nakaShow.format.toLowerCase() === 'movie' || nakaShow.episodesList.length === 1)
            return nakaShow.episodesList[0].id;

        const seasonId = nakaShow.seasons.find(season => season.number === (episodeInfo?.season ?? 1)).id;
        this.log("seasonid:", seasonId);
        
        return nakaShow.episodesList.find(episode => episode.seasonId === seasonId && episode.number === (episodeInfo?.episode ?? 1)).id;
    }

    async fetchSources(nakaId, episodeInfo = null)
    {
        const episodeId = await this.getEpisodeNakaId(nakaId, episodeInfo);

        return await this.fetchAndDecryptAPI('/api/sources/anime', {
            method: 'POST',
            headers: {
                'User-Agent': this.userAgent,
                'Origin': this.baseUrl,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                anime_id: nakaId,
                episode_id: episodeId,
            })
        });
    }

    extractUrlFromSources(sources, language = null)
    {
        const filteredSources = language ? sources.filter(source => source.language === language) : sources;

        for(const source of filteredSources)
        {
            try
            {
                return execSync(`yt-dlp -q --no-warnings -g ${source.url}`).toString().trim();
            }
    
            catch(e)
            {
                this.log(`Impossible to extract url from ${source.host}: ${e}`);
            }
        }
        
        return "";
    }

    async fetchVideoInfo(id, episodeInfo = null, language = null)
    {
        const nakaId = await this.getNakaId(id);
        if(nakaId < 0)
            return { url: ''}

        const sources = await this.fetchSources(nakaId, episodeInfo);

        return { url: this.extractUrlFromSources(sources, language) };
    }

    async fetchAvailability(id, episodeInfo = null, language = null)
    {
        const nakaId = await this.getNakaId(id);
        if(nakaId < 0)
            return null;

        const sources = await this.fetchSources(nakaId, episodeInfo);

        let languages = [];

        if(language)
            languages.push(language);
        else
        {
            for(const source of sources)
            {
                if(!languages.includes(source.language))
                    languages.push(source.language);
            }
        }

        const urls = languages
            .map(lang => ({lang, url: this.extractUrlFromSources(sources, lang)}))
            .filter(urlByLang => urlByLang.url !== "");

        this.log(urls, language);

        return urls.length > 0 ? 
            urls.map(url => ({
                name: this.name,
                language: url.lang
            })) : 
            null;
    }
}