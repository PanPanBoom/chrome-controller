import { App } from "../App.js";
import { remoteConstants } from "../../constants.js";

export class Netflix extends App
{
    constructor()
    {
        super(
            ".main-header, .billboard-links, .sliderContent",
            "a.slider-refocus, .navigation-tab > a, a.playLink, button"
        );

        this.state = 0;
    }

    handle(key, tabId)
    {
        if(key === remoteConstants.DPad.validate)
            this.validate(tabId);

        else if(key === remoteConstants.back)
            this.back(tabId);

        else
            this.navigate(key, tabId);
    }

    async navigate(key, tabId)
    {
        await this.updateSelectors(tabId);

        if(this.state == 2)
            this.navigateInPlayer(key, tabId);
        else
            super.navigate(key, tabId);
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

    async navigateInPlayer(key, tabId)
    {
        let newX = this.x;
        let newY = this.y;
        
        if(newX < 0 || newY < 0)
        {
            newX = 0;
            newY = 0;
        }

        else
        {
            if(key === remoteConstants.DPad.up) {
                newY--;
                newX = 0;
            } else if(key === remoteConstants.DPad.down){ 
                newY++;
                newX = 0;
            } else if(key === remoteConstants.DPad.left) newX--;
            else if(key === remoteConstants.DPad.right) newX++;
        }

        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ this, newX, newY ],
            func: (platform, x, y) => {
                const rows = Array.from(document.querySelectorAll(platform.rowsSelector));
                const rowsWithItems = platform.itemsSelector === "" ? rows.map((row) => [row]) : rows.map((row) => Array.from(row.querySelectorAll(platform.itemsSelector)));
                const allItems = platform.itemsSelector === "" ? rows : Array.from(document.querySelectorAll(platform.itemsSelector));

                const inactiveElement = document.querySelectorAll('.inactive, .passive');
                if(inactiveElement.length > 0)
                    inactiveElement[0].click();

                if(y >= rowsWithItems.length || y < 0 || x >= rowsWithItems[y].length || x < 0)
                    return false;

                const activeElement = rowsWithItems[y][x];

                activeElement.focus();
                allItems.forEach(items => items.style.outline = '');
                activeElement.style.outline = "3px solid white";
                activeElement.style.borderRadius = "4px";

                return true;
            }
        });

        if(results[0].result)
        {
            this.x = newX;
            this.y = newY;
        }
    }

    async updateSelectors(tabId)
    {
        console.log("Debut updateSelectors : " + [this.x, this.y].join(", "));
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                if(document.querySelectorAll('.previewModal--container').length > 0)
                    return 1;
                else if(document.querySelectorAll('.watch-video').length > 0)
                    return 2;
                else if(document.querySelectorAll('.default-ltr-iqcdef-cache-1seef1c').length > 0)
                    return 3;

                return 0;
            }
        })

        if(this.state !== results[0].result)
        {
            this.x = -1;
            this.y = -1;
            
            this.state = results[0].result;
            
            switch(this.state)
            {
                case 0: // Selection screen
                    this.rowsSelector = this.baseRowsSelector;
                    this.itemsSelector = this.baseItemsSelector;
                    break;
    
                case 1: // Modal info
                    this.rowsSelector = ".previewModal-close > span, .previewModal--player-titleTreatment a, .episodeSelector-dropdown button, .episodeSelector-dropdown li, .episode-item"; 
                    this.itemsSelector = ""
                    break;
    
                case 2: // Video player
                    this.rowsSelector = ".default-ltr-iqcdef-cache-fwwk01, .default-ltr-iqcdef-cache-19uofy3, .default-ltr-iqcdef-cache-1e7fe8i, .watch-video";
                    this.itemsSelector = "li, .default-ltr-iqcdef-cache-rnz48h, .default-ltr-iqcdef-cache-1enhvti, .watch-video--skip-content-button";
                    break;
    
                case 3: // Search results
                    this.rowsSelector = ".default-ltr-iqcdef-cache-1cglebk";
                    this.itemsSelector = ".default-ltr-iqcdef-cache-1cglebk a";    
                    break;
            }
        }

        console.log("Fin updateSelectors : " + [this.x, this.y].join(", "));

    }

    submit(input, tabId)
    {
        chrome.tabs.update(tabId, { url: "https://www.netflix.com/search?q=" + input})
    }
}