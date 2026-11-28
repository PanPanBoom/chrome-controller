import { gotScraping } from "got-scraping";
import { Source } from "./Source.js";
import { serverLog } from "../utils.js";
import 'dotenv/config';

export class BowdtvSource extends Source
{
    constructor()
    {
        super('Bowdtv', 'https://bowdtv.com/', 'vod-player/');
    }

    async login()
    {
        if(!this.bearer || this.bearer.length === 0)
        {
            this.log('Logging in...');
            try
            {
                const res = await gotScraping.post('https://auth.bowdtv.com/api/auth/sign-in/username', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    json: {
                        username: process.env.BOWDTV_USERNAME,
                        password: process.env.BOWDTV_PASSWORD
                    }
                });

                const cookie = res.headers["set-cookie"][0].split(';')[0];

                const responses = await Promise.all([
                    gotScraping.get('https://auth.bowdtv.com/api/auth/token', {
                        headers: {
                            cookie
                        }
                    }),
                    gotScraping.get('https://auth.bowdtv.com/api/profiles', {
                        headers: {
                            cookie
                        }
                    })
                ]);
    
                this.bearer = `Bearer ${JSON.parse(responses[0].body).token}`;
                this.profile = JSON.parse(responses[1].body).profiles[0].id;
            }

            catch(e)
            {
                this.log(e);
            }
        }

        this.log(this.bearer);
    }

    fetchUrl(id, episodeInfo)
    {
        return `${this.watchUrl}${id}${id.includes('tv') ? `?sa=${episodeInfo?.season ?? 1}&epi=${episodeInfo?.episode ?? 1}` : ''}`;
    }

    async fetchSource(id, episodeInfo)
    {
        const showEndpoint = `https://api.bowdtv.com/api/v1/vod/${id}`;
        const params = new URLSearchParams();
        
        if(id.includes('tv'))
        {
            params.append('sa', episodeInfo?.season ?? 1);
            params.append('epi', episodeInfo?.episode ?? 1);
        }

        const sourcesRes = await gotScraping.get(`${showEndpoint}/probe${params.keys.length > 0 ? '?' + params : ''}`, {
            headers: {
                Authorization: this.bearer
            }
        });

        const rawSources = JSON.parse(sourcesRes.body);
        this.log(rawSources);
        if(rawSources?.flux?.length === 0)
            return null;

        const getLangScore = (item) => {
            const langs = item.audioLanguages || [];
            if (langs.length > 1 && langs.includes('fr')) return 3;
            if (item.lang === 'VF' || langs.includes('fr')) return 2;
            if (item.lang === 'VO') return 1;
            return 0;
        };

        const getQualityScore = (quality) => {
            if (!quality) return 0;
            if (quality === 'SD') return 360;
            return parseInt(quality, 10) || 0;
        };

        const sources = [...rawSources.flux]
                .filter(source => source.ok)
                .sort((a, b) => 
                    getLangScore(b) - getLangScore(a) ||
                    getQualityScore(b.quality) - getQualityScore(a.quality) ||
                    (b.audioLanguages?.length || 0) - (a.audioLanguages?.length || 0) ||
                    Number(Boolean(b.webPortable)) - Number(Boolean(a.webPortable))
                );

        this.log(sources);

        params.append('token', sources[0].token);
        params.append('profile', this.profile);
        params.append('lang', 'fr');

        return this.resolveAd(showEndpoint, params);
    }

    async resolveAd(showEndpoint, params)
    {
        const res = await gotScraping.get(`${showEndpoint}/stream?${params}`, {
            headers: {
                Authorization: this.bearer
            }
        });

        const data = JSON.parse(res.body);

        if(Object.keys(data).includes("ad"))
        {
            this.log('Resolving ad:', data.ad);

            await new Promise(res => setTimeout(res, data.ad.skippableAfterSec * 1000));

            await gotScraping.post("https://api.bowdtv.com/api/v1/playback/ad-complete", {
                headers: {
                    Authorization: this.bearer
                },
                json: {
                    beaconChallenge: data.ad.beaconChallenge,
                    played: 1
                }
            });

            return this.resolveAd(showEndpoint, params);
        }

        return data;
    }

    async fetchVideoInfo(id, episodeInfo)
    {
        return this.getSource(id, episodeInfo)
            .then(source => ({
                url: source?.url,
                referer: source?.headers?.Referer ?? source?.headers?.referer ?? this.baseUrl,
                userAgent: source?.headers?.['User-Agent'] ?? source?.headers?.['user-agent'] ?? this.userAgent,
                type: source?.type === 'hls' ? 'm3u8' : source.type
            }));
    }

    async fetchAvailability(id, episodeInfo)
    {
        await this.login();

        const source = await this.getSource(id, episodeInfo);

        serverLog(source);

        return source ?
            [{
                name: this.name,
                language: source?.lang ?? 'Multi'
            }] :
            null;
    }
}