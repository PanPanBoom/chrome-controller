import { Page } from "../Page.js";
import { remoteConstants } from "../../constants.js";

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

    async applyNavigation(tabId, newX, newY)
    {
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

        return results[0].result;
    }
}