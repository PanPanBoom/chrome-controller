import { remoteConstants } from "../constants.js";
import { ShowPage } from "./ShowPage.js";

export class App
{
    constructor()
    {
        if(this.constructor == App)
            throw new Error("Abstract classes can't be instantiated.");

        this.pages = [];
        this.currentPageIndex = 0;
        this.currentShow = "";
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
        this.updatePageIndex(currentPageIndex, tabId);
        this.pages[currentPageIndex].navigate(key, tabId);
    }

    updatePageIndex(newId, tabId)
    {
        if(newId != this.currentPageIndex)
        {
            this.currentPageIndex = newId;
            this.updateCurrentShow(tabId);
            this.pages[newId].reset();
        }
    }

    async updateCurrentShow(tabId)
    {
        let newShow = "";

        if(this.pages[this.currentPageIndex] instanceof ShowPage)
            newShow = await this.pages[this.currentPageIndex].getShow(tabId);

        if(newShow !== this.currentShow)
        {
            this.currentShow = newShow;
            fetch('http://localhost:3000/showUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newShow })
            });
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