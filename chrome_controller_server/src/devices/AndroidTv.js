import { Device } from "./Device.js";
import { AndroidRemote, RemoteDirection, RemoteKeyCode } from "androidtv-remote";
import { io } from '../../server.js';
import fs from 'fs';
import { ApiManager } from "../APIs/ApiManager.js";
import { remoteConstants } from "../constants.js";

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
            if(this.isMuted !== volume.muted)
            {
                console.log("muteChanged");
                io.emit('muteChanged', { muted: volume.muted });
                this.isMuted = volume.muted;
            }
        });

        return await this.remote.start();
    }

    keyPress(key, direction)
    {
        if(key === remoteConstants.volume.mute)
        {
            this.isMuted = !this.isMuted;
            io.emit('muteChanged', { muted: this.isMuted });
        }

        else
            this.remote.sendKey(key, direction);
    }

    async openUrl(url)
    {
        this.remote.sendAppLink(url);
    }

    async castShow(platform, id, episodeInfo = null, startTime = 0)
    {
        const intent = await ApiManager.getShowIntent(platform, id, episodeInfo, startTime);

        await this.openUrl(intent);
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

    sendCode(code)
    {
        return this.remote.sendCode(code);
    }
}