import { Router } from "express";
import { apps } from "../src/apps.js";
import devicesRoutes from "./devices/routes.js";
import playerRoutes from "./player/routes.js";
import showsRoutes from "./shows/routes.js";
import { execSync } from "child_process";
import fs from 'fs';
import os from 'os';
import { serverLog } from "../src/utils.js";
import { ApiManager } from "../src/APIs/ApiManager.js";
import remoteRoutes from "./remote/routes.js";

const getProfilePicturePath = () => {
    const sid = execSync('powershell -command "[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value"').toString().trim();
    const imagePath = execSync(`powershell -command "(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AccountPicture\\Users\\${sid}').Image448"`).toString().trim();

    return imagePath;
}

export default function apiRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use((req, res, next) => {
        serverLog(`API Call: [${req.method}] ${req.path}`);

        next();
    });

    router.use('/shows', showsRoutes(io));
    router.use('/devices', devicesRoutes(io));
    router.use('/player', playerRoutes(io));
    router.use('/remote', remoteRoutes(io));

    router.get('/apps', (req, res) => {
        serverLog('Apps demandées');
        res.json(apps.map(app => ({
            ...app,
            filters: ApiManager.getFilters(app.name.toLowerCase())
        })));
    });

    router.get('/ping', (req, res) => {
        const imagePath = getProfilePicturePath();
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');

        serverLog({
            name: os.userInfo().username,
            platform: os.type(),
            img: `data:image/jpeg;base64,${imageBase64}`,
            tv: false
        });

        res.json({
            name: os.userInfo().username,
            platform: os.type(),
            img: `data:image/jpeg;base64,${imageBase64}`,
            tv: false
        });
    });
    
    return router;
}