import { remoteConstants } from "../constants.js";

export class App
{
    constructor(rowsSelector, itemsSelector)
    {
        if(this.constructor == App)
            throw new Error("Abstract classes can't be instantiated.");

        this.pages = [];
    }

    reset()
    {
        
    }

    handle(key, tabId)
    {
        throw new Error("Must be implemented.");
    }

    async getCurrentPage(tabId)
    {
        for(let i = 0; i < this.pages.length; i++)
        {
            const results = await chrome.scripting.executeScript({
                target: { tabId: tabId },
                args: [ this.pages[i] ],
                func: (page) => document.querySelectorAll(page.identifier).length > 0
            });

            if(results[0].result)
                return this.pages[i];
        }
    }

    async validate(tabId)
    {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ await this.getCurrentPage(tabId) ],
            func: (platform) => {
                const rows = Array.from(document.querySelectorAll(platform.rowsSelector));
                const rowsWithItems = platform.itemsSelector === "" ? rows.map((row) => [row]) : rows.map((row) => Array.from(row.querySelectorAll(platform.itemsSelector)));
                
                rowsWithItems[platform.y][platform.x].click();
            }
        })
    }

    back(tabId)
    {
        chrome.tabs.goBack(tabId, () => {
            if(chrome.runtime.lastError)
                console.log("Impossible de go back");
        })
    }

    setInput(input, tabId)
    {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ input ],
            func: (input) => {
                console.log(document.activeElement.children)
                if(document.activeElement.tagName.toLowerCase() === "input")
                    document.activeElement.value = input;
            }
        })
    }

    submit(input, tabId)
    {
        throw new Error("Must be implemented.");
    }
}