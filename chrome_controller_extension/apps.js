importScripts("constants.js");

class App
{
    constructor(rowsSelector, itemsSelector)
    {
        if(this.constructor == App)
            throw new Error("Abstract classes can't be instantiated.");

        this.rowsSelector = rowsSelector;
        this.itemsSelector = itemsSelector;
    }

    handle(key, tabId)
    {
        throw new Error("Must be implemented.");
    }

    async validate(key, tabId)
    {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                document.activeElement.click();

                let stateUpdate = 0;
                if(document.activeElement.title === "close")
                    stateUpdate = -1;
                else if(document.activeElement.className.includes("slider-refocus"))
                    stateUpdate = 1;

                return stateUpdate;
            }
        })

        console.log(results);

        return results[0].result;
    }

    navigate(key, tabId)
    {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ key.toLowerCase(), this, remoteConstants ],
            func: (key, selectors, remoteConstants) => {
                const rows = Array.from(document.querySelectorAll(selectors.rowsSelector));
                const rowsWithItems = selectors.itemsSelector === "" ? rows.map((row) => [row]) : rows.map((row) => Array.from(row.querySelectorAll(selectors.itemsSelector)));
                const allItems = selectors.itemsSelector === "" ? rows : Array.from(document.querySelectorAll(selectors.itemsSelector));
                console.log(rowsWithItems);

                // rowsWithItems[4][3].focus();
                let x = -1, y = -1;

                rowsWithItems.forEach((row, index) => {
                    const activeElementIndex = row.indexOf(document.activeElement);

                    if(activeElementIndex >= 0)
                    {
                        x = activeElementIndex;
                        y = index;
                    }
                });

                console.log(x + " " + y);

                if(x < 0 || y < 0)
                    rowsWithItems[0][0].focus();
                else
                {
                    if(key === remoteConstants.DPad.up) {
                        y--;
                        x = 0;
                    } else if(key === remoteConstants.DPad.down){ 
                        y++;
                        x = 0;
                    } else if(key === remoteConstants.DPad.left) x--;
                    else if(key === remoteConstants.DPad.right) x++;

                    console.log(x + " " + y);

                    rowsWithItems[y][x].focus();
                }

                document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                allItems.forEach(items => items.style.outline = '');
                document.activeElement.style.outline = "3px solid white";
                document.activeElement.style.borderRadius = "4px";
            }
        })
    }
}

class Netflix extends App
{
    constructor()
    {
        super(".tabbed-primary-navigation, .billboard-links, .sliderContent", "a.slider-refocus, .navigation-tab > a, a.playLink");
        this.state = 0;
    }

    handle(key, tabId)
    {
        if(key === remoteConstants.DPad.validate)
            this.validate(key, tabId);

        else
            this.navigate(key, tabId);
    }

    async validate(key, tabId)
    {
        this.state += await super.validate(key, tabId);
        console.log(this.state);
        this.updateSelectors();
    }

    updateSelectors()
    {
        switch(this.state)
        {
            case 0:
                this.rowsSelector = ".tabbed-primary-navigation, .billboard-links, .sliderContent";
                this.itemsSelector = "a.slider-refocus, .navigation-tab > a, a.playLink";
                break;

            case 1:
                this.rowsSelector = ".previewModal-close > span, .previewModal--player-titleTreatment a, .episodeSelector-dropdown button, .episodeSelector-dropdown li, .episode-item"; 
                this.itemsSelector = ""
                break;
        }
    }
}

class Youtube extends App
{
    constructor()
    {
        super("#contents.ytd-rich-grid-renderer", "a.yt-lockup-view-model__content-image");
    }
}

const apps = {
    youtube: new Youtube(),
    netflix: new Netflix()
}