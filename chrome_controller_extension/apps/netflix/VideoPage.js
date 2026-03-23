import { Container } from "../Container.js";
import { ShowPage } from "../ShowPage.js";

export class VideoPage extends ShowPage
{
    constructor()
    {
        super(
            [
                new Container(".watch-video", "[data-uia='control-flag'], [data-uia='control-nav-back']", "row"),
                new Container(".watch-video", ".watch-video--skip-content-button", "row"),
                new Container("[data-uia='selector-episode']", ".default-ltr-iqcdef-cache-rnz48h", "column"),
                new Container(".default-ltr-iqcdef-cache-fwwk01", "li", "column"),
                new Container(".default-ltr-iqcdef-cache-1npqywr", "[data-uia^='control-play-pause-'], [data-uia$='10'], [data-uia^='control-volume-'], [data-uia='control-next'], [data-uia='control-episodes'], [data-uia='control-audio-subtitle'], [data-uia='control-speed'], [data-uia^='control-fullscreen']", "row"),
                new Container(".default-ltr-iqcdef-cache-zjik7", ".default-ltr-iqcdef-cache-1csye0r", "row")
            ],
            '.watch-video'
        );
    }

    applyNavigation = (containers, oldItemIndex, oldContainerIndex, newItemIndex, newContainerIndex) =>
    {
        let containersWithItems = getContainersWithItems(containers);

        const inactiveElement = document.querySelectorAll('.inactive, .passive');
        if(inactiveElement.length > 0)
            inactiveElement[0].click();

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