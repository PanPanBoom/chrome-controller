import { App } from "../App.js";
import { Page } from "../Page.js";
import { Container } from "../Container.js";

export class Twitch extends App
{
    constructor()
    {
        super();

        this.pages = [
            new Page([
                new Container("#side-nav", "a, [data-a-target*='side-nav-show']", "column"),
                new Container("[data-a-target='front-page-carousel']", "[data-a-target='featured-item-left-button'], [data-a-target='featured-item'], [data-a-target='featured-item-right-button']", "row"),
                new Container(".find-me", "button", "row")
            ], "#side-nav")
        ]
    }
}