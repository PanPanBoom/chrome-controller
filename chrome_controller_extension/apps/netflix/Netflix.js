import { App } from "../App.js";
import { remoteConstants } from "../../constants.js";
import { Page } from "../Page.js";
import { VideoPage } from "./VideoPage.js";
import { Container } from "../Container.js";

export class Netflix extends App
{
    constructor()
    {
        super();

        this.pages = [
            new Page([
                new Container(".previewModal--container", ".previewModal-close > span, .previewModal--player-titleTreatment a, .episodeSelector-dropdown button, .episodeSelector-dropdown li, .episode-item", "column")
            ], '.previewModal--container'),
            new VideoPage(),
            new Page([
                new Container(".default-ltr-iqcdef-cache-1cglebk", ".default-ltr-iqcdef-cache-1cglebk a", "row")
            ], '.default-ltr-iqcdef-cache-1seef1c'),
            new Page([
                new Container(".main-header", ".navigation-tab > a", "row"),
                new Container(".subgenres", "[aria-labelledby='profileLanguageDropDown-header']", "row"),
                new Container(".sub-menu-list", ".sub-menu a", "column"),
                new Container(".billboard-links", ".billboard-links button", "row"),
                new Container(".slider", "a.slider-refocus, .handlePrev, .handleNext", "row"),
            ], ".main-header")
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