import { remoteConstants } from "../constants.js";
import { ShowPage } from "./ShowPage.js";
import { VideoPage } from "./VideoPage.js";

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

    async handle(key, tabId)
    {
        await this.updatePageIndex(tabId);
        switch(key)
        {
            case remoteConstants.DPad.validate:
                this.validate(tabId);
                break;

            case remoteConstants.DPad.back:
                this.back(tabId);
                break;

            case remoteConstants.videoControls.rewind:
                this.moveCurrentTime(tabId, -1);
                break;

            case remoteConstants.videoControls.forward:
                this.moveCurrentTime(tabId, 1);
                break;

            case remoteConstants.videoControls.playPause:
                this.togglePlayPause(tabId);
                break;

            default:
                this.navigate(key, tabId);
                break;
        }
    }

    navigate(key, tabId)
    {
        this.pages[this.currentPageIndex].navigate(key, tabId);
    }

    async updatePageIndex(tabId)
    {
        const newIndex = await this.getCurrentPageIndex(tabId);
        if(newIndex != this.currentPageIndex)
        {
            this.currentPageIndex = newIndex;

            this.updateCurrentShow(tabId);
            this.alertServerForVideoPage();
            this.pages[newIndex].reset();
        }
    }

    async alertServerForVideoPage()
    {
        console.log("alerting remote for video");
        fetch("http://localhost:3000/remote/videoUpdate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ onVideoPage: this.pages[this.currentPageIndex] instanceof VideoPage})
        });
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

    togglePlayPause(tabId)
    {
        const currentPage = this.pages[this.currentPageIndex];
        console.log(currentPage);
        if(currentPage instanceof VideoPage)
            currentPage.togglePlayPause(tabId);
    }

    moveCurrentTime(tabId, value)
    {
        const currentPage = this.pages[this.currentPageIndex];
        if(currentPage instanceof VideoPage)
            currentPage.moveCurrentTime(tabId, value);
    }
}