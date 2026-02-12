import { remoteConstants } from "../constants.js";

export class App
{
    constructor(rowsSelector, itemsSelector)
    {
        if(this.constructor == App)
            throw new Error("Abstract classes can't be instantiated.");

        this.rowsSelector = rowsSelector;
        this.itemsSelector = itemsSelector;
        this.x = -1;
        this.y = -1;

        Object.defineProperties(this, {
            baseRowsSelector: {
                value: this.rowsSelector,
                writable: false
            },
            baseItemsSelector: {
                value: this.itemsSelector,
                writable: false
            }
        });
    }

    reset()
    {
        this.rowsSelector = this.baseRowsSelector;
        this.itemsSelector = this.baseItemsSelector;
    }

    handle(key, tabId)
    {
        throw new Error("Must be implemented.");
    }

    validate(tabId)
    {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ this ],
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

    async navigate(key, tabId)
    {
        console.log("Debut navigate : " + [this.x, this.y].join(", "));
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

                if(y >= rowsWithItems.length || y < 0 || x >= rowsWithItems[y].length || x < 0)
                    return false;

                const activeElement = rowsWithItems[y][x];

                activeElement.focus();
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

        console.log("Fin navigate : " + [this.x, this.y].join(", "));

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