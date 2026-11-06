import { Router } from "express";
import currentDeviceRoutes from "./current/routes.js";
import extensionRoutes from "./extension/routes.js";
import androidTVRoutes from "./androidtv/routes.js";
import { serverLog } from "../../src/utils.js";
import { state } from "../../src/state.js";
import Bonjour from 'bonjour';

const bonjour = new Bonjour();

export default function devicesRoutes(io)
{
    const router = Router({ mergeParams: true });

    router.use('/androidtv', androidTVRoutes(io));
    router.use('/current', currentDeviceRoutes(io));
    router.use('/extension', extensionRoutes(io));

    router.get('/', (req, res) => {
        const devices = [{
            name: "Extension",
            host: req.hostname,
            ip: ''
        }];

        const bonjourBrowser = bonjour.find({ type: 'androidtvremote2' }, (device) => {
            devices.push({
                name: device.name,
                host: device.host,
                ip: device.addresses[0]
            });
        });

        serverLog('Recherche des appareils sur le réseau local...');

        setTimeout(() => {
            bonjourBrowser.stop();
            serverLog(state?.currentDevice?.ip);
            const orderedDevices = [
                devices.splice(devices.findIndex(device => device.ip === state?.currentDevice?.ip), 1)[0],
                ...devices
            ];
            serverLog(orderedDevices);
            res.json(orderedDevices);
        }, 3000);
    });

    return router;
}