import { Page } from "../Page.js";
import { Container } from "../Container.js";

export class Homepage extends Page
{
    constructor()
    {
        super([
            new Container(".main-header", ".navigation-tab > a, [data-uia='search-box-launcher']", "row"),
            new Container(".subgenres", "[aria-labelledby='profileLanguageDropDown-header']", "row"),
            new Container(".sub-menu-list", ".sub-menu a", "column"),
            new Container(".billboard-links", ".billboard-links button", "row"),
            new Container(".slider", "a.slider-refocus, .handlePrev, .handleNext", "row"),
        ], ".main-header");
    }
}