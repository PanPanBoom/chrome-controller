import { App } from "../App.js";
import { remoteConstants } from "../../constants.js";
import { Page } from "../Page.js";
import { VideoPage } from "./VideoPage.js";
import { Container } from "../Container.js";
import { Homepage } from "./Homepage.js";
import { PreviewModalPage } from "./PreviewModalPage.js";
import { SearchResultsPage } from "./SearchResultsPage.js";
import { ShowPage } from "../ShowPage.js";

export class Netflix extends App
{
    constructor()
    {
        super();

        this.pages = [
            new PreviewModalPage(),
            new VideoPage(),
            new SearchResultsPage(),
            new Homepage()
        ];
    }

    updatePageIndex(newIndex, tabId)
    {
        if(newIndex != this.currentPageIndex)
        {
            this.currentPageIndex = newIndex;
            this.updateCurrentShow(tabId)

            if(newIndex < this.pages.length - 1)
                this.pages[newIndex].reset();
        }
    }

    submit(input, tabId)
    {
        chrome.tabs.update(tabId, { url: "https://www.netflix.com/search?q=" + input})
    }
}