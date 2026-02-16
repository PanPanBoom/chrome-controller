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
            new Page([], '.previewModal--container'),
            new VideoPage(),
            new Page([], '.default-ltr-iqcdef-cache-1seef1c'),
            new Homepage()
        ];
    }

    updatePageIndex(newId)
    {
        if(newId != this.currentPageIndex)
        {
            this.currentPageIndex = newId;
            if(!(this.pages[newId] instanceof Homepage))
                this.pages[newId].reset();
        }
    }

    submit(input, tabId)
    {
        chrome.tabs.update(tabId, { url: "https://www.netflix.com/search?q=" + input})
    }
}