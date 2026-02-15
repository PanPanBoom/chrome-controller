import { Page } from "../Page.js";

export class Homepage extends Page
{
    constructor()
    {
        super(
            ".main-header, .billboard-links, .slider, .subgenres, .sub-menu",
            "a.slider-refocus, .navigation-tab > a, a.playLink, button, .handlePrev, .handleNext, [aria-labelledby='profileLanguageDropDown-header'], .sub-menu a",
            ".main-header"
        );
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


        const activeElementRect = rowsWithItems[finalY][finalX].getBoundingClientRect();

        if(activeElementRect.x + activeElementRect.width > window.innerWidth)
        {
            if(oldX < finalX)
                finalX = rowsWithItems[finalY].length - 1;
            else
            {
                while(finalX > 0 && rowsWithItems[finalY][finalX].getBoundingClientRect().x + rowsWithItems[finalY][finalX].getBoundingClientRect().width > window.innerWidth)
                    finalX--;
            }
        }
        else if(activeElementRect.x < 0)
        {
            if(oldX > finalX)
                finalX = 0;
            else
            {
                while(finalX < rowsWithItems[finalY].length - 1 && rowsWithItems[finalY][finalX].getBoundingClientRect().x < 0)
                    finalX++;
            }
        }

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