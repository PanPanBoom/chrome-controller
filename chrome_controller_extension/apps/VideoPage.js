import { ShowPage } from "./ShowPage.js";

export class VideoPage extends ShowPage
{
    async togglePlayPause(tabId)
    {
        console.log("toggleplaypause");
        chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                const video = document.querySelector('video');

                video.paused ? video.play() : video.pause();
            }
        })
    }

    moveCurrentTime(tabId, value)
    {
        chrome.scripting.executeScript({
            target: { tabId },
            args: [ value ],
            func: (value) => document.querySelector('video').currentTime += value * 10000
        });
    }
}