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

        const finalCoordinates = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ this, this.x, this.y, newX, newY ],
            func: this.applyNavigation
        });
        console.log(finalCoordinates);

        this.x = finalCoordinates[0].result.x;
        this.y = finalCoordinates[0].result.y;
    }

    applyNavigation = (selectors, oldX, oldY, newX, newY) =>
    {
        const rows = Array.from(document.querySelectorAll(selectors.rowsSelector));
        const rowsWithItems = selectors.itemsSelector === "" ? rows.map((row) => [row]) : rows.map((row) => Array.from(row.querySelectorAll(selectors.itemsSelector)));
        const allItems = selectors.itemsSelector === "" ? rows : Array.from(document.querySelectorAll(selectors.itemsSelector));

        let finalX = newX;
        let finalY = newY;

        if(finalY >= rowsWithItems.length)
            finalY = 0;
        else if(finalY < 0)
            finalY = rowsWithItems.length - 1;

        if(finalX >= rowsWithItems[finalY].length)
            finalX = rowsWithItems[finalY].length - 1;
        else if(finalX < 0)
            finalX = 0;

        const activeElement = rowsWithItems[finalY][finalX];

        if(oldY !== finalY)
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        allItems.forEach(items => items.style.outline = '');
        activeElement.style.outline = "3px solid white";
        activeElement.style.borderRadius = "4px";

        return {
            x: finalX,
            y: finalY
        };
    }
}