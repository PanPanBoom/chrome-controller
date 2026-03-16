import { Router } from "express";
import COMMANDS from '../../chrome_controller_extension/constants.js';
import { apps } from "./apps.js";
import os from 'os';
import { execSync } from "child_process";
import fs from 'fs';
import * as streamingAvailability from 'streaming-availability';
import 'dotenv/config';

const getProfilePicturePath = () => {
    const sid = execSync('powershell -command "[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value"').toString().trim();
    const imagePath = execSync(`powershell -command "(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AccountPicture\\Users\\${sid}').Image448"`).toString().trim();

    return imagePath;
}

export default function remoteRoutes(io) {
    const router = Router();

    const apiClient = new streamingAvailability.Client(new streamingAvailability.Configuration({
        apiKey: process.env.API_KEY
    }))

    const TTL = 24 * 60 * 60 * 1000;
    let cache = {
        "": {
            data: null,
            lastFetch: null
        },
        "series": {
            data: null,
            lastFetch: null
        },
        "movie": {
            data: null,
            lastFetch: null
        }
    };

    const getTopShowsData = async (filter) => {
        const now = Date.now();

        if(cache[filter].data && (now - cache[filter].lastFetch) < TTL) return cache[filter].data;

        let requestParams = {
            country: 'fr',
            service: 'netflix',
            outputLanguage: 'fr'
        };

        if(filter !== "")
            requestParams.showType = filter;

        const data = await apiClient.showsApi.getTopShows(requestParams);

        cache[filter].data = data.map(show => ({
            title: show.title,
            img: show.imageSet.horizontalPoster.w1440,
            link: show.streamingOptions.fr.filter(streamingOption => streamingOption.service.id.toLowerCase() === "netflix")[0].link,
            overview: show.overview
        }));
        cache[filter].lastFetch = now;

        return cache[filter].data;
    }
    
    router.get('/ping', (req, res) => {
        const imagePath = getProfilePicturePath();
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');

        res.json({
            name: os.userInfo().username,
            platform: os.type(),
            img: `data:image/jpeg;base64,${imageBase64}`
        });
    });

    router.get('/apps', (req, res) => {
        console.log('Apps demandées');
        res.json(apps);
    });
    
    router.get('/config/commands', (req, res) => {
        console.log(`Constantes chargées : ${JSON.stringify(COMMANDS)}`);
        res.json(COMMANDS);
    });
    
    router.get('/keyboard', (req, res) => {
        console.log("Trigger le clavier sur l'application");
        io.emit('keyboard');
        res.send({ status : 'ok' });
    });

    router.get('/topShows', (req, res) => {
        console.log('Shows demandés');
        console.log(req.query["show_type"]);
        getTopShowsData(req.query['show_type']).then(data => res.json(data));
    })

    return router;
}
