const sendCommand = async (ip: string, command: string, init?: RequestInit) => await fetch(`http://${ip}:3000/api/${command}`, init);

export const sendPing = async (ip: string) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 30000);

    return await sendCommand(ip, "ping", { signal: controller.signal });
}

export const getCommands = async (ip: string) => await sendCommand(ip, 'remote/config');

export const sendKeyPress = async (ip: string, key: number, direction: number) => await sendCommand(ip, 'devices/current/keypress', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key, direction })
});

export const sendVolume = async (ip: string, volumeValue: number) => await sendCommand(ip, 'devices/current/volume', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ volumeValue })
});

export const sendMute = async (ip: string) => await sendCommand(ip, 'devices/current/mute', {
    method: 'POST'
});

export const getisMuted = async (ip: string) => await sendCommand(ip, 'devices/current/mute');

export const sendInput = async (ip: string, input: string) => await sendCommand(ip, 'devices/current/input', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input })
});

export const submitInput = async (ip: string, input: string) => await sendCommand(ip, 'devices/current/input/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input })
});

export const sendFullscreenToggle = async (ip: string) => await sendCommand(ip, 'devices/extension/fullscreen');

export const sendAppLaunch = async (ip: string, url: string) => await sendCommand(ip, 'devices/current/url', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
});

export const sendShowCast = async (ip: string, platform: string, id: string, episodeInfo: {season: number, episode: number} | null = null, startTime: number = 0, source: string | null = null, language: string | null = null) => {
    return await sendCommand(ip, `shows/${platform}/${id}${id.includes('tv') ? `/seasons/${episodeInfo?.season ?? 1}/episodes/${episodeInfo?.episode ?? 1}` : ''}/cast`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startTime, source, language })
    });
}

export const getApps = async (ip: string) => await sendCommand(ip, 'apps');

export const getTopShows = async (ip: string, platform: string, filter: string) => {
    const params = new URLSearchParams();
    params.append("showType", filter);

    return await sendCommand(ip, `shows/${platform}/trending?${params}`);
}

export const getShowLists = async (ip: string, platform: string, filter: string) => {
    const params = new URLSearchParams();
    params.append("filter", filter);

    return await sendCommand(ip, `shows/${platform}/lists?${params}`);
}

export const searchShow = async (ip: string, platform: string, search: string, filter: string) => {
    const params = new URLSearchParams();
    params.append("search", search);
    params.append("filter", filter);

    return await sendCommand(ip, `shows/${platform}/search?${params}`);
}

export const getShowById = async (ip: string, id: string) => await sendCommand(ip, `shows/tmdb/${id}`);

export const getSeasonById = async (ip: string, showId: string, seasonNumber: number) => await sendCommand(ip, `shows/tmdb/${showId}/seasons/${seasonNumber}`);

export const getShowReviews = async (ip: string, showId: string) => await sendCommand(ip, `shows/tmdb/${showId}/reviews`);

export const isShowAvailable = async (ip: string, onMessage: (m: any) => void, showId: string, episodeInfo: {season: number, episode: number} | null = null) => {
    const res = await sendCommand(ip, `shows/tmdb/${showId}${showId.includes('tv') ? `/seasons/${episodeInfo?.season ?? 1}/episodes/${episodeInfo?.episode ?? 1}` : ''}/sources`);
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true)
    {
        const { done, value } = await reader.read();
        if(done)
            break;

        buffer += decoder.decode(value, { stream: true });

        let i;
        while((i = buffer.indexOf('\n')) >= 0)
        {
            const line = buffer.slice(0, i).trim();
            buffer = buffer.slice(i + 1);
            if(line)
                onMessage(JSON.parse(line));
        }
    }
}

export const sendZoom = async (ip: string, zoomValue: number) => await sendCommand(ip, 'devices/extension/zoom', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ zoomValue })
});

// export const sendFavorite = async (ip: string, isFavorite: boolean) => await sendCommand(ip, `${isFavorite ? 'add' : 'remove' }Favorite`, {
//     method: isFavorite ? 'POST' : 'DELETE',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// export const getIsVideoEnabled = async (ip: string) => await sendCommand(ip, 'extension/videoEnabled');

export const getDevices = async (ip: string) => await sendCommand(ip, 'devices');

export const connectTv = async (ipServer: string, ipTv: string) => await sendCommand(ipServer, 'devices/androidtv/pairing', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ip: ipTv })
});

export const sendTvCode = async (ip: string, code: string) => await sendCommand(ip, 'devices/androidtv/pairing/code', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
});

export const getPeopleFilmography = async (ip: string, peopleId: string) => await sendCommand(ip, `shows/tmdb/${peopleId}/filmography`);