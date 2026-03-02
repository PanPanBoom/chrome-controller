import { io } from 'socket.io-client'

export const socket = io("http://192.168.1.46:3000", {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Connecté au serveur");
});

const sendCommand = async (ip: string, command: string, init?: RequestInit) => await fetch(`http://${ip}:3000/${command}`, init);

export const sendPing = async (ip: string, signal: AbortController["signal"]) => await sendCommand(ip, 'remote/ping', {signal});

export const getCommands = async (ip: string) => await sendCommand(ip, 'remote/config/commands');

export const sendKeyPress = async (ip: string, key: string) => await sendCommand(ip, 'extension/keypress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key })
    });

export const sendVolume = async (ip: string, volumeValue: number) => await sendCommand(ip, 'volume', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ volumeValue })
    });

export const sendInput = async (ip: string, input: string) => await sendCommand(ip, 'extension/input', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
    });

export const submitInput = async (ip: string, input: string) => await sendCommand(ip, 'extension/input/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
    });

export const sendFullscreenToggle = async (ip: string) => await sendCommand(ip, 'extension/fullscreen');

export const sendAppLaunch = async (ip: string, url: string) => await sendCommand(ip, 'extension/open', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

export const getApps = async (ip: string) => await sendCommand(ip, 'remote/apps');