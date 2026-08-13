import { Router } from "express";
import { remoteConstants} from './constants.js'
import { apps } from "./apps.js";
import os from 'os';
import { execSync } from "child_process";
import fs from 'fs';
import * as streamingAvailability from 'streaming-availability';
import 'dotenv/config';
import { google } from 'googleapis';
import { youtube } from "googleapis/build/src/apis/youtube/index.js";
import { ApiManager } from "./APIs/ApiManager.js";
import Bonjour from 'bonjour';

const bonjour = new Bonjour();

const getProfilePicturePath = () => {
    const sid = execSync('powershell -command "[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value"').toString().trim();
    const imagePath = execSync(`powershell -command "(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AccountPicture\\Users\\${sid}').Image448"`).toString().trim();

    return imagePath;
}

export default function remoteRoutes(io) {
    const router = Router();
    
    router.get('/ping', (req, res) => {
        const imagePath = getProfilePicturePath();
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');

        res.json({
            name: os.userInfo().username,
            platform: os.type(),
            img: `data:image/jpeg;base64,${imageBase64}`,
            tv: false
        });
    });

    router.get('/apps', (req, res) => {
        console.log('Apps demandées');
        res.json(apps.map(app => ({
            ...app,
            filters: ApiManager.getFilters(app.name.toLowerCase())
        })));
    });
    
    router.get('/config/commands', (req, res) => {
        console.log(`Constantes chargées : ${JSON.stringify(remoteConstants)}`);
        res.json(remoteConstants);
    });
    
    router.get('/keyboard', (req, res) => {
        console.log("Trigger le clavier sur l'application");
        io.emit('keyboard');
        res.send({ status : 'ok' });
    });

    router.get('/topShows', (req, res) => {
        console.log('Shows demandés');
        ApiManager.getTopShows(req.query.platform.toLowerCase(), req.query.showType)
        .then(data => res.json(data));
    });

    router.get('/searchShow', (req, res) => {
        console.log('Recherche de show: ' + req.query.search);
        ApiManager.searchShowsByTitle(req.query.search, req.query.filter)
        .then(data => res.json(data));
    });

    router.get('/show', (req, res) => {
        ApiManager.getShowById(req.query.id, req.query.mediaType)
        .then(data => res.json(data));
    });

    router.get('/season', (req, res) => {
        ApiManager.getSeasonById(req.query.showId, req.query.seasonNumber)
        .then(data => res.json(data));
    });

    router.post('/videoUpdate', (req, res) => {
        const { onVideoPage } = req.body;
        console.log('update video : ' + onVideoPage);
        io.emit(`video${onVideoPage ? 'Enabled' : 'Disabled'}`);

        res.send({ status: 'ok' });
    });

    router.get('/devices', (req, res) => {
        const devices = [{
            name: "Extension",
            host: req.hostname,
            ip: req.ip
        }];

        const bonjourBrower = bonjour.find({ type: 'androidtvremote2' }, (device) => {
            devices.push({
                name: device.name,
                host: device.host,
                ip: device.addresses[0]
            });
        });

        console.log('Recherche des appareils sur le réseau local...');

        setTimeout(() => {
            bonjourBrower.stop();
            console.log(devices);
            res.json(devices);
        }, 3000);
    });

    return router;
}