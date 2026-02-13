import { App } from "../App.js";
import { remoteConstants } from "../../constants.js";
import { Page } from "../Page.js";
import { VideoPage } from "./VideoPage.js";
import { Homepage } from "./Homepage.js";

export class Netflix extends App
{
    constructor()
    {
        super();

        this.pages = [
            new Page(".previewModal-close > span, .previewModal--player-titleTreatment a, .episodeSelector-dropdown button, .episodeSelector-dropdown li, .episode-item", "", '.previewModal--container'),
            new VideoPage(),
            new Page(".default-ltr-iqcdef-cache-1cglebk", ".default-ltr-iqcdef-cache-1cglebk a", '.default-ltr-iqcdef-cache-1seef1c'),
            new Homepage()
        ];
    }

    updatePageIndex(newId)
    {
        if(newId != this.currentPageIndex)
        {
            this.currentPageIndex = newId;
            if(!(this.pages[newId] instanceof Homepage))
            {
                console.log(typeof this.pages[newId]);
                console.log("reset");
                this.pages[newId].reset();
            }
        }
    }

    validate(tabId)
    {
        super.validate(tabId);

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => document.activeElement.tagName.toLowerCase() === "input"
        }).then(results => {
            if(results[0].result)
                fetch("http://localhost:3000/keyboard");
        });
    }

    submit(input, tabId)
    {
        chrome.tabs.update(tabId, { url: "https://www.netflix.com/search?q=" + input})
    }
}