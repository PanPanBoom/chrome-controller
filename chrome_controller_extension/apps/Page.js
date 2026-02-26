import { remoteConstants } from "../constants.js";

export class Page
{
    constructor(containers, identifier)
    {
        this.itemInPageIndex = -1;
        this.containerInPageIndex = -1;
        this.currentContainerIndex = -1;
        this.identifier = identifier;
        this.containers = containers;
    }

    reset()
    {
        this.itemInPageIndex = -1;
        this.containerInPageIndex = -1;
    }

    async validate(tabId)
    {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ this.containers, this.containerInPageIndex, this.itemInPageIndex ],
            func: (containers, containerIndex, itemIndex) => {
                let containersWithItems = getContainersWithItems(containers);

                const activeElement = containersWithItems[containerIndex].items[itemIndex];

                activeElement.focus();
                activeElement.click();
            }
        });

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => document.activeElement.tagName.toLowerCase() === "input"
        }).then(results => {
            if(results[0].result)
                fetch("http://localhost:3000/remote/keyboard");
        });
    }

    async navigate(key, tabId)
    {
        let newItemIndex = this.itemInPageIndex;
        let newContainerIndex = this.containerInPageIndex;
        
        if(newItemIndex < 0 || newContainerIndex < 0)
        {
            newItemIndex = 0;
            newContainerIndex = 0;
        }

        else
        {
            const { up, down, left, right } = remoteConstants.DPad;
            const isRow = this.containers[this.currentContainerIndex].direction === "row";

            if(key === (isRow ? up : left)) {
                newContainerIndex--;
                newItemIndex = 0;
            }

            else if(key === (isRow ? down : right)) {
                newContainerIndex++;
                newItemIndex = 0;
            }

            else if(key === (isRow ? left : up))
                newItemIndex--;
            else if(key === (isRow ? right : down))
                newItemIndex++;
        }

        const finalCoordinates = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            args: [ this.containers, this.itemInPageIndex, this.containerInPageIndex, newItemIndex, newContainerIndex ],
            func: this.applyNavigation
        });

        this.itemInPageIndex = finalCoordinates[0].result.itemIndex;
        this.containerInPageIndex = finalCoordinates[0].result.containerIndex;
        this.currentContainerIndex = finalCoordinates[0].result.currentContainerIndex;
    }

    applyNavigation = (containers, oldItemIndex, oldContainerIndex, newItemIndex, newContainerIndex) =>
    {
        let containersWithItems = getContainersWithItems(containers);

        let finalItemIndex = newItemIndex;
        let finalContainerIndex = newContainerIndex;

        if(finalContainerIndex >= containersWithItems.length)
            finalContainerIndex = 0;
        else if(finalContainerIndex < 0)
            finalContainerIndex = containersWithItems.length - 1;

        if(finalItemIndex >= containersWithItems[finalContainerIndex].items.length)
            finalItemIndex = containersWithItems[finalContainerIndex].items.length - 1;
        else if(finalItemIndex < 0)
            finalItemIndex = 0;

        containersWithItems.flat().forEach(container => container.items.forEach(item => item.style.outline = ''));

        const activeElement = containersWithItems[finalContainerIndex].items[finalItemIndex];

        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        activeElement.style.outline = "3px solid white";
        activeElement.style.borderRadius = "4px";

        return {
            itemIndex: finalItemIndex,
            containerIndex: finalContainerIndex,
            currentContainerIndex: containersWithItems[finalContainerIndex].containerIndex
        };
    }
}