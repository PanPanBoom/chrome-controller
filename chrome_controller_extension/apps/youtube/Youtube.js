import { App } from "../App.js";

export class Youtube extends App
{
    constructor()
    {
        super("#contents.ytd-rich-grid-renderer", "a.yt-lockup-view-model__content-image");
    }
}