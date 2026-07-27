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

export const sendKeyPress = async (ip: string, key: number) => await sendCommand(ip, 'extension/keypress', {
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

export const sendMute = async (ip: string) => await sendCommand(ip, 'mute', {
    method: 'POST'
});

export const getisMuted = async (ip: string) => await sendCommand(ip, 'isMuted');

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

export const getTopShows = async (ip: string, platform: string, filter: string) => {
    const params = new URLSearchParams();
    params.append("showType", filter);
    params.append("platform", platform);

    return await sendCommand(ip, `remote/topShows?${params}`);
}

export const searchShow = async (ip: string, search: string) => {
    const params = new URLSearchParams();
    params.append("search", search);

    return await sendCommand(ip, `remote/searchShow?${params}`);
}

export const sendZoom = async (ip: string, zoomValue: number) => await sendCommand(ip, 'extension/zoom', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ zoomValue })
});

export const sendFavorite = async (ip: string, isFavorite: boolean) => await sendCommand(ip, `${isFavorite ? 'add' : 'remove' }Favorite`, {
    method: isFavorite ? 'POST' : 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getIsVideoEnabled = async (ip: string) => await sendCommand(ip, 'extension/videoEnabled');

export const getDevices = async (ip: string) => await sendCommand(ip, 'remote/devices');

export const connectTv = async (ipServer: string, ipTv: string) => await sendCommand(ipServer, 'connectTv', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ip: ipTv })
});

export const sendTvCode = async (ip: string, code: string) => await sendCommand(ip, 'tvCode', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
});