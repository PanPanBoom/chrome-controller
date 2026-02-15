import { App } from "../App.js";
import { Page } from "../Page.js";

export class Twitch extends App
{
    constructor()
    {
        super();

        this.pages = [
            new Page("[data-test-selector='followed-channel']", "", "[data-test-selector='followed-channel']")
        ]
    }
}