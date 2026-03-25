import { TwitchPage } from "./TwitchPage.js";
import { Container } from "../Container.js";

export class TwitchVideoPage extends TwitchPage
{
    constructor()
    {
        super([
            new Container("[data-a-target='player-controls']", "button", "row")
        ], "[data-a-target='video-player']");
    }

    applyNavigation = (containers, oldItemIndex, oldContainerIndex, newItemIndex, newContainerIndex) => {
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

        if(containersWithItems[finalContainerIndex].containerIndex === containers.length - 1)
            activeElement.focus();
        
        if(oldItemIndex !== finalItemIndex && containers[containersWithItems[finalContainerIndex].containerIndex].direction === "column")
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