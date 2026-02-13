import { Page } from "../Page.js";

export class Homepage extends Page
{
    constructor()
    {
        super(
            ".main-header, .billboard-links, .slider",
            "a.slider-refocus, .navigation-tab > a, a.playLink, button, .handlePrev, .handleNext",
            ".main-header"
        );
    }
}