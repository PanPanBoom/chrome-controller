import { Device } from "./Device.js";
import { io } from '../../server.js';

export class Extension extends Device
{
    constructor()
    {
        super("");
    }

    keyPress(key)
    {
        io.emit('command', { action: "HANDLE", key});
    }
}