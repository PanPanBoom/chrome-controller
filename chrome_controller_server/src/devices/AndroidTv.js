import { Device } from "./Device.js";
import { AndroidRemote, RemoteDirection, RemoteKeyCode } from "androidtv-remote";
import { io } from '../../server.js';
import fs from 'fs';
import { charToKeycode } from "../constants.js";
import { remoteMessageManager } from "androidtv-remote/dist/remote/RemoteMessageManager.js";

export class AndroidTv extends Device {
    constructor(ip)
    {
        super(ip);
        this.currentApp = null;
        this.lastInputSent = "";

        console.log(`Connecting to TV at ${ip}...`);
        
        let cert = {};

        try
        {
            cert = JSON.parse(fs.readFileSync('cert.json', 'utf8'));
        } 
        
        catch(e)
        {
            console.log("No certificate found, starting pairing process...");
        }

        this.remote = new AndroidRemote(ip, {
            pairing_port : 6467,
            remote_port : 6466,
            name : 'androidtv-remote',
            cert: cert,
        });

        console.log(`Connected to TV at ${ip}`);
        console.log(this.remote);

        this.remote.on('secret', () => {
            io.emit('tvCodeRequest');
        });

        this.remote.on('ready', () => {
            let cert = this.remote.getCertificate();

            fs.writeFile('cert.json', JSON.stringify(cert), (e) => console.log(e));
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
        })

        this.remote.start();
    }

    keyPress(key)
    {
        this.remote.sendKey(key, RemoteDirection.SHORT);
    }

    openUrl(url)
    {
        this.remote.sendAppLink(url);
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

    sendCode(code)
    {
        this.remote.sendCode(code);
    }
}