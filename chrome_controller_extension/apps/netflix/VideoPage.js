import { Page } from "../Page.js";

export class VideoPage extends Page
{
    constructor()
    {
        super(
            ".default-ltr-iqcdef-cache-fwwk01, .default-ltr-iqcdef-cache-19uofy3, .default-ltr-iqcdef-cache-1e7fe8i, .watch-video, .default-ltr-iqcdef-cache-zjik7",
            "li, .default-ltr-iqcdef-cache-rnz48h, .default-ltr-iqcdef-cache-1enhvti, .watch-video--skip-content-button, .default-ltr-iqcdef-cache-1csye0r",
            '.watch-video'
        );
    }

    applyNavigation = (selectors, oldX, oldY, newX, newY) =>
    {
        const rows = Array.from(document.querySelectorAll(selectors.rowsSelector));
        const rowsWithItems = selectors.itemsSelector === "" ? rows.map((row) => [row]) : rows.map((row) => Array.from(row.querySelectorAll(selectors.itemsSelector)));
        const allItems = selectors.itemsSelector === "" ? rows : Array.from(document.querySelectorAll(selectors.itemsSelector));

        const inactiveElement = document.querySelectorAll('.inactive, .passive');
        if(inactiveElement.length > 0)
            inactiveElement[0].click();
        
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