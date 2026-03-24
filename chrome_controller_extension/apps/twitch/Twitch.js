import { App } from "../App.js";
import { TwitchPage } from "./TwitchPage.js";
import { Container } from "../Container.js";
import { TwitchVideoPage } from "./TwitchVideoPage.js";

export class Twitch extends App
{
    constructor()
    {
        super();

        this.pages = [
            new TwitchVideoPage(),
            new TwitchPage([
                new Container("[data-a-target='front-page-carousel']", "[data-a-target='featured-item-left-button'], [data-a-target='featured-item'], [data-a-target='featured-item-right-button']", "row"),
                new Container(".find-me", "button", "row")
            ], "#side-nav")
        ]
    }
}