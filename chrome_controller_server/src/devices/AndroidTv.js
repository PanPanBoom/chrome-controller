import { Device } from "./Device.js";
import { AndroidRemote, RemoteDirection } from "androidtv-remote";
import { io } from '../../server.js';
import fs from 'fs';

export class AndroidTv extends Device {
    constructor(ip)
    {
        super(ip);

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

    sendCode(code)
    {
        this.remote.sendCode(code);
    }
}