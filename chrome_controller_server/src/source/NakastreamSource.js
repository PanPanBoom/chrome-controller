import { ScrappingBrowser } from "../ScrappingBrowser.js";
import { Source } from "./Source.js";
import 'dotenv/config';
import { gotScraping } from 'got-scraping';

export class NakastreamSource extends Source
{
    constructor()
    {
        super("https://naka.cx", "/player?id=");
        this.clearanceCookie = "";
    }

    async login()
    {
        if(!this.headers)
        {
            const page = await ScrappingBrowser.getNewPage();

            const tokenPromise = page.waitForResponse(this.baseUrl + "/api/v1/captcha/login/redeem");
            await page.goto(this.baseUrl + '/login')
            const tokenRes = await tokenPromise;
            const token = await tokenRes.json();

            const context = await ScrappingBrowser.getContext();
            const cookies = await context.cookies();
            this.clearanceCookie = 'cf_clearance=' + cookies.find(c => c.name === 'cf_clearance')?.value;
            this.userAgent = await page.evaluate(() => navigator.userAgent);

            console.log("Logging in...");

            const evaluationResult = await page.evaluate(async ({ baseUrl, email, password, captchaToken }) => {
                const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
                    method: 'POST',
                    "headers": {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, captchaToken })
                });

                const text = await response.text();
                let data = null;
                try { data = JSON.parse(text); } catch(e) {}

                return {
                    status: response.status,
                    statusText: response.statusText,
                    data: data,
                    rawText: text
                };
            }, {
                baseUrl: this.baseUrl,
                email: process.env.NAKASTREAM_MAIL,
                password: process.env.NAKASTREAM_PASSWORD,
                captchaToken: token.token
            });

            // console.log(res);

            if(evaluationResult.status !== 200)
            {
                console.log(`Error ${evaluationResult.status} while login: ${evaluationResult.statusText}`);
                console.log(`Server details: ${evaluationResult.rawText}`);
                return false;
            }

            this.headers = {
                accept: 'application/json',
                Authorization: `Bearer ${evaluationResult.data.token}`,
                'User-Agent': this.userAgent,
                'Cookie': `cf_clearance=${this.clearanceCookie}`,
                Referer: this.baseUrl + '/'
            };

            await ScrappingBrowser.close();

            return true;
        }

        return true;
    }

    async getNakaId(id)
    {
        try
        {
            await this.login();
    
            console.log("Fetching nakastream id...");
    
            const showRes = await gotScraping.get(`${this.baseUrl}/api/v1/browse/by-tmdb/${id}`, {
                headers: this.headers,
                headerGeneratorOptions: {
                    browsers: [{ name: 'chrome', minVersion: 110 }],
                    devices: ['desktop'],
                    operatingSystems: ['windows']
                }
            });
    
            const showData = JSON.parse(showRes.body);
    
            console.log("Nakastream id: " + showData.id);
    
            return showData.id;
        } catch(err) {
            console.log('Error fetching nakastream id: ', err);
            return null;
        }
    }

    async getShowUrl(id, episodeInfo = null)
    {
        super.getShowUrl(id, episodeInfo);
        return `${this.watchUrl}${await this.getNakaId(id)}${id.includes('tv') ? `&season=${episodeInfo?.season ?? 1}&episode=${episodeInfo?.episode ?? 1}` : ""}`;
    }

    async getShowVideoInfo(id, episodeInfo)
    {
        super.getShowVideoInfo(id, episodeInfo);
        try {
            const nakaId = await this.getNakaId(id);
    
            console.log("Fetching nakastream source...");
    
            const resSource = await gotScraping.get(`${this.baseUrl}/api/v1/streaming/source/${nakaId}${id.includes("tv") ? `?season=${episodeInfo?.season ?? 1}&episode=${episodeInfo?.episode ?? 1}` : ""}`, {
                headers: this.headers,
                headerGeneratorOptions: {
                    browsers: [{ name: 'chrome', minVersion: 110 }],
                    devices: ['desktop'],
                    operatingSystems: ['windows']
                }
            });
    
            const source = JSON.parse(resSource.body);
    
            const videoUrl = this.baseUrl + source.url;
    
            console.log('Source nakastream: ' + videoUrl);
    
            return {
                url: videoUrl,
                referer: await this.getShowUrl(id, episodeInfo),
                cookies: this.clearanceCookie,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
            }
        } catch (err) {
            console.error("Error fetching nakastream source: ", err);
            return null;
        }
    }

    async checkShowAvailability(id, episodeInfo = null)
    {
        super.checkShowAvailability(id, episodeInfo);
        try
        {
            await this.login();
    
            const [ mediaType, realId ] = id.split("/");
    
            const res = await gotScraping.get(`${this.baseUrl}/api/v1/streaming/check/${realId}?type=${mediaType}`, {
                headers: this.headers,
                headerGeneratorOptions: {
                    browsers: [{ name: 'chrome', minVersion: 110 }],
                    devices: ['desktop'],
                    operatingSystems: ['windows']
                }
            });
            
            const availabilty = JSON.parse(res.body);
    
            console.log(availabilty);
    
            return availabilty.available;
        } catch (err) {
            console.error("Error checking show availability: ", err);
            return false;
        }
    }
}