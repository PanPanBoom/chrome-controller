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
    }

    fetchUrl(id, episodeInfo)
    {
        return `${this.watchUrl}${id}${id.includes('tv') ? `?sa=${episodeInfo?.season ?? 1}&epi=${episodeInfo?.episode ?? 1}` : ''}`;
    }

    async fetchSource(id, episodeInfo)
    {
        const params = new URLSearchParams();
        
        params.append('flux', 'auto');
        params.append('profile', this.profile);
        params.append('want', 'VO');
        // params.append('lang', 'fr');
        if(id.includes('tv'))
        {
            params.append('sa', episodeInfo?.season ?? 1);
            params.append('epi', episodeInfo?.episode ?? 1);
        }

        const streamPromise = gotScraping.get(`https://api.bowdtv.com/api/v1/vod/${id}/stream?${params}`, {
            headers: {
                Authorization: this.bearer
            }
        });

        const res = await streamPromise;
        const data = JSON.parse(res.body);

        if(Object.keys(data).includes("ad"))
        {
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

            const videoRes = await streamPromise;

            return JSON.parse(videoRes);
        }

        return data;
    }

    async fetchVideoInfo(id, episodeInfo)
    {
        return this.getSource(id, episodeInfo)
            .then(source => ({
                url: source?.url,
                referer: this.baseUrl,
                userAgent: this.userAgent,
                type: source?.type
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
                language: source.lang
            }] :
            null;
    }
}