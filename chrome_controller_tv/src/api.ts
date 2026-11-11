import { VideoInfo } from "../components/VideoPlayer";

const sendCommand = async (ip: string, command: string, init?: RequestInit) => await fetch(`${ip}/api/${command}`, init);

const showPath = (showId: VideoInfo['showId'], episodeInfo: VideoInfo['episodeInfo'] = null) => `shows/tmdb/${showId}${showId.includes('tv') ? `/seasons/${episodeInfo?.season ?? 1}/episodes/${episodeInfo?.episode ?? 1}` : ''}`;

export const updateStartTime = async (ip: string, showId: VideoInfo['showId'], episodeInfo: VideoInfo['episodeInfo'] = null, progress: number, videoDuration: number) => await sendCommand(ip, `${showPath(showId, episodeInfo)}/progress`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nextStartTime: progress * 1000,
        percentageWatched: progress / videoDuration * 100
    })
});

export const sendVideoEnd = async (ip: string, showId: VideoInfo['showId'], episodeInfo: VideoInfo['episodeInfo'], audioLanguage: string | undefined) => await sendCommand(ip, `${showPath(showId, episodeInfo)}/end`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        audioLanguage
    })
});

export const getSubtitles = async (ip: string, showId: VideoInfo['showId'], episodeInfo: VideoInfo['episodeInfo'], videoDuration: number) => await sendCommand(ip, `${showPath(showId, episodeInfo)}/subtitles?duration=${videoDuration}`);

export const readSubtitles = async (ip: string, subtitlesUrl: string) => await sendCommand(ip, `player/proxy-subtitles?url=${encodeURIComponent(subtitlesUrl)}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});