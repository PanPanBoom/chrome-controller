import { remoteConstants } from "../constants.js";

export class Page
{
    constructor(rowsSelector, itemsSelector, identifier)
    {
        this.x = -1;
        this.y = -1;
        this.rowsSelector = rowsSelector;
        this.itemsSelector = itemsSelector;
        this.identifier = identifier;
    }

    reset()
    {
        this.x = -1;
        this.y = -1;
    }

    async navigate(key, tabId)
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

        if(await this.applyNavigation(tabId, newX, newY, newY != this.y))
        {
            this.x = newX;
            this.y = newY;
        }
    }

    async applyNavigation(tabId, newX, newY, scroll)
    {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ this, newX, newY, scroll ],
            func: (platform, x, y, scroll) => {
                const rows = Array.from(document.querySelectorAll(platform.rowsSelector));
                const rowsWithItems = platform.itemsSelector === "" ? rows.map((row) => [row]) : rows.map((row) => Array.from(row.querySelectorAll(platform.itemsSelector)));
                const allItems = platform.itemsSelector === "" ? rows : Array.from(document.querySelectorAll(platform.itemsSelector));

                if(y >= rowsWithItems.length || y < 0 || x >= rowsWithItems[y].length || x < 0)
                    return false;

                const activeElement = rowsWithItems[y][x];

                if(scroll)
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                allItems.forEach(items => items.style.outline = '');
                activeElement.style.outline = "3px solid white";
                activeElement.style.borderRadius = "4px";

                return true;
            }
        });

        return results[0].result;
    }
}