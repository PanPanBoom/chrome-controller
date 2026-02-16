import { Container } from "../Container.js";
import { Page } from "../Page.js";

export class Homepage extends Page
{
    constructor()
    {
        super(
            [
                new Container(".main-header", ".navigation-tab > a", "row"),
                new Container(".subgenres", "[aria-labelledby='profileLanguageDropDown-header']", "row"),
                new Container(".sub-menu-list", ".sub-menu a", "column"),
                new Container(".billboard-links", ".billboard-links button", "row"),
                new Container(".slider", "a.slider-refocus, .handlePrev, .handleNext", "row"),
            ],
            ".main-header"
        );
    }

    applyNavigation = (containers, oldItemIndex, oldContainerIndex, newItemIndex, newContainerIndex) =>
    {
        let containersWithItems = [];
        
        containers.forEach((container, containerIndex) => {
            const containerElements = Array.from(document.querySelectorAll(container.selectors));
            const containerWithItems = containerElements.map((el) => {
                const items = container.itemsSelectors === "" ? [el] : Array.from(el.querySelectorAll(container.itemsSelectors));
                
                items.forEach(item => item.style.outline = '');

                return {
                    items: items,
                    containerIndex: containerIndex
                };
            });

            containersWithItems = containersWithItems.concat(containerWithItems);
        });

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

        const activeElementRect = containersWithItems[finalContainerIndex].items[finalItemIndex].getBoundingClientRect();

        if(activeElementRect.x + activeElementRect.width > window.innerWidth)
        {
            if(oldItemIndex < finalItemIndex)
                finalItemIndex = containersWithItems[finalContainerIndex].items.length - 1;
            else
            {
                while(finalItemIndex > 0 && containersWithItems[finalContainerIndex].items[finalItemIndex].getBoundingClientRect().x + containersWithItems[finalContainerIndex].items[finalItemIndex].getBoundingClientRect().width > window.innerWidth)
                    finalItemIndex--;
            }
        }
        else if(activeElementRect.x < 0)
        {
            if(oldItemIndex > finalItemIndex)
                finalItemIndex = 0;
            else
            {
                while(finalItemIndex < containersWithItems[finalContainerIndex].items.length - 1 && containersWithItems[finalContainerIndex].items[finalItemIndex].getBoundingClientRect().x < 0)
                    finalItemIndex++;
            }
        }

        const activeElement = containersWithItems[finalContainerIndex].items[finalItemIndex];

        if(oldContainerIndex !== finalContainerIndex)
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