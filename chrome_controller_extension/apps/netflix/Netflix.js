import { App } from "../App.js";
import { Homepage } from "./Homepage.js";
import { PreviewModalPage } from "./PreviewModalPage.js";
import { SearchResultsPage } from "./SearchResultsPage.js";
import { NetflixVideoPage } from "./NetflixVideoPage.js";

export class Netflix extends App
{
    constructor()
    {
        super();

        this.pages = [
            new PreviewModalPage(),
            new NetflixVideoPage(),
            new SearchResultsPage(),
            new Homepage()
        ];
    }

    updatePageIndex(newIndex, tabId)
    {
        if(newIndex != this.currentPageIndex)
        {
            this.currentPageIndex = newIndex;
            this.updateCurrentShow(tabId);
            this.alertServerForVideoPage();

            if(newIndex < this.pages.length - 1)
                this.pages[newIndex].reset();
        }
    }

    submit(input, tabId)
    {
        chrome.tabs.update(tabId, { url: "https://www.netflix.com/search?q=" + input})
    }
}