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
            try
            {
                const accessRes = await gotScraping.get(`${this.baseUrl}/api/v1/access`, {
                    headerGeneratorOptions: {
                        browsers: [{ name: 'chrome', minVersion: 110 }],
                        devices: ['desktop'],
                        operatingSystems: ['windows']
                    }
                });
    
                const accessData = JSON.parse(accessRes.body);

                let token = null;
                if(accessData?.captcha?.login)
                {
                    const page = await ScrappingBrowser.getNewPage();
        
                    const tokenPromise = page.waitForResponse(this.baseUrl + "/api/v1/captcha/login/redeem");
                    await page.goto(this.baseUrl + '/login')
                    const tokenRes = await tokenPromise;
                    token = await tokenRes.json();
        
                    const context = await ScrappingBrowser.getContext();
                    const cookies = await context.cookies();
                    this.clearanceCookie = 'cf_clearance=' + cookies.find(c => c.name === 'cf_clearance')?.value;
                    this.userAgent = await page.evaluate(() => navigator.userAgent);
    
                    await ScrappingBrowser.close();
                }
    
                console.log("Logging in...");
    
                const loginRes = await gotScraping.post(`${this.baseUrl}/api/v1/auth/login`, {
                    json: {
                        email: process.env.NAKASTREAM_MAIL,
                        password: process.env.NAKASTREAM_PASSWORD,
                        captchaToken: token?.token
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': this.userAgent
                    }
                });
    
                const loginData = JSON.parse(loginRes.body);
    
                this.headers = {
                    accept: 'application/json',
                    Authorization: `Bearer ${loginData.token}`,
                    'User-Agent': this.userAgent,
                    'Cookie': `cf_clearance=${this.clearanceCookie}`,
                    Referer: this.baseUrl + '/'
                };
    
                return true;
            } catch (err) {
                console.error("Error during login: ", err);
                return false;
            }
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
                userAgent: this.userAgent
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