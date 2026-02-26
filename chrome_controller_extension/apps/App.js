import { remoteConstants } from "../constants.js";

export class App
{
    constructor()
    {
        if(this.constructor == App)
            throw new Error("Abstract classes can't be instantiated.");

        this.pages = [];
        this.currentPageIndex = 0;
    }

    reset()
    {
        this.pages.forEach(page => page.reset());
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
        const currentPageIndex = await this.getCurrentPageIndex(tabId);
        this.updatePageIndex(currentPageIndex);
        this.pages[currentPageIndex].navigate(key, tabId);
    }

    updatePageIndex(newId)
    {
        if(newId != this.currentPageIndex)
        {
            this.currentPageIndex = newId;
            this.pages[newId].reset();
        }
    }

    async getCurrentPageIndex(tabId)
    {
        for(let i = 0; i < this.pages.length; i++)
        {
            const results = await chrome.scripting.executeScript({
                target: { tabId: tabId },
                args: [ this.pages[i] ],
                func: (page) => document.querySelectorAll(page.identifier).length > 0
            });

            if(results[0].result)
                return i;
        }
    }

    async validate(tabId)
    {
        await this.pages[this.currentPageIndex].validate(tabId);
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