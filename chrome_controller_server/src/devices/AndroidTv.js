import { Device } from "./Device.js";
import { AndroidRemote, RemoteDirection, RemoteKeyCode } from "androidtv-remote";
import { io } from '../../server.js';
import fs from 'fs';
import puppeteer from 'puppeteer';

export class AndroidTv extends Device {
    constructor(ip)
    {
        super(ip);
        this.currentApp = null;
        this.lastInputSent = "";
    }

    async init()
    {
        console.log(`Connecting to TV at ${this.ip}...`);
        
        let cert = {};

        try
        {
            cert = JSON.parse(fs.readFileSync('cert.json', 'utf8'));
        } 
        
        catch(e)
        {
            console.log("No certificate found, starting pairing process...");
        }

        this.remote = new AndroidRemote(this.ip, {
            pairing_port : 6467,
            remote_port : 6466,
            name : 'androidtv-remote',
            cert: cert,
        });

        console.log(`Connected to TV at ${this.ip}`);
        console.log(this.remote);

        this.remote.on('secret', () => {
            io.emit('tvCodeRequest');
        });

        this.remote.on('ready', () => {
            let cert = this.remote.getCertificate();

            fs.writeFile('cert.json', JSON.stringify(cert), (e) => console.log(e));

            io.emit('videoEnabled');
        });

        this.remote.on('error', (err) => {
            console.error('AndroidTvRemote error: ', err);
        });

        this.remote.on('current_app', (current_app) => {
            console.log('updating current app');
            this.currentApp = current_app;
        });

        this.remote.on('input', () => {
            console.log("Show keyboard");
            io.emit('keyboard');
        });

        this.remote.on('volume', (volume) => {
            console.log(volume);
            this.isMuted = volume.muted;
        });

        return await this.remote.start();
    }

    keyPress(key)
    {
        this.remote.sendKey(key, RemoteDirection.SHORT);
    }

    async openUrl(url)
    {
        let finalUrl = url;
        if(url.includes("noxpulse"))
        {
            const browser = await puppeteer.launch({ 
                headless: true
            })

            const page = await browser.newPage()

            // Masquer les traces de Puppeteer
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false })
            })

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

            await page.goto(url, { waitUntil: 'networkidle2' })

            // Attendre que la vidéo ait un src valide
            try
            {
                await page.waitForFunction(() => {
                    const video = document.querySelector('video')
                    return video?.currentSrc && !video.currentSrc.includes('blob:') && video.currentSrc.length > 0
                }, { timeout: 30000 });
            }

            catch(err)
            {
                console.log(err);
            }

            const videoUrl = await page.evaluate(() => {
                return document.querySelector('video')?.currentSrc
            })

            finalUrl = "chromecontroller://play?url=" + videoUrl;
        }

        console.log(finalUrl);
        this.remote.sendAppLink(finalUrl);
    }

    sendInput(input)
    {
        if(this.lastInputSent.length > input.length)
            this.keyPress(RemoteKeyCode.KEYCODE_DEL);

        else
            this.remote.sendText(input[input.length - 1]);

        this.lastInputSent = input;
    }

    submitInput(input)
    {
        this.keyPress(RemoteKeyCode.KEYCODE_ENTER);
    }

    handleVolume(volumeValue)
    {
        this.keyPress(volumeValue > 0 ? RemoteKeyCode.KEYCODE_VOLUME_UP : RemoteKeyCode.KEYCODE_VOLUME_DOWN, RemoteDirection.SHORT);
    }

    toggleMute()
    {
        super.toggleMute();
        this.keyPress(RemoteKeyCode.KEYCODE_MUTE);
    }

    sendCode(code)
    {
        return this.remote.sendCode(code);
    }
}