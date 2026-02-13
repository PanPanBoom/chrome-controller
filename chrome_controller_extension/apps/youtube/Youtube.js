import { App } from "../App.js";
import { Page } from "../Page.js";

export class Youtube extends App
{
    constructor()
    {
        super();
        this.pages = [
            new Page("#contents.ytd-rich-grid-renderer", "a.yt-lockup-view-model__content-image", "#contents.ytd-rich-grid-renderer")
        ]
    }
}