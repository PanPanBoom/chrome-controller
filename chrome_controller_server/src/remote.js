import { Router } from "express";
import COMMANDS from '../../chrome_controller_extension/constants.js';
import { apps } from "./apps.js";
import os from 'os';
import { execSync } from "child_process";
import fs from 'fs';

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

    return router;
}
