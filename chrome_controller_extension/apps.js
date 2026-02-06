importScripts("constants.js");

class App
{
    constructor(rowsSelector, itemsSelector)
    {
        if(this.constructor == App)
            throw new Error("Abstract classes can't be instantiated.");

        this.rowsSelector = rowsSelector;
        this.itemsSelector = itemsSelector;

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
            func: () => document.activeElement.click()
        })
    }

    back(tabId)
    {
        chrome.tabs.goBack(tabId, () => {
            if(chrome.runtime.lastError)
                console.log("Impossible de go back");
        })
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

    reset()
    {
        super.reset();
        this.state = 0;
    }

    back(tabId)
    {
        super.back(tabId);
        this.state--;
        console.log(this.state);
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

    navigate(key, tabId)
    {
        if(this.state == 2)
        {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
                }
            });
        }

        super.navigate(key, tabId)
    }

    async validate(tabId)
    {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                document.activeElement.click();

                let stateUpdate = 1;
                if(document.activeElement.title === "close")
                    stateUpdate = -1;
                else if(document.activeElement.className.includes("navigation-tab"))
                    stateUpdate = 0;

                return stateUpdate;
            }
        })

        this.state += results[0].result;
        console.log(this.state);
        this.updateSelectors();
    }

    updateSelectors()
    {
        switch(this.state)
        {
            case 0:
                this.rowsSelector = this.baseRowsSelector;
                this.itemsSelector = this.baseItemsSelector;
                break;

            case 1:
                this.rowsSelector = ".previewModal-close > span, .previewModal--player-titleTreatment a, .episodeSelector-dropdown button, .episodeSelector-dropdown li, .episode-item"; 
                this.itemsSelector = ""
                break;

            case 2:
                this.rowsSelector = ".watch-video";
                this.itemsSelector = "button";
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