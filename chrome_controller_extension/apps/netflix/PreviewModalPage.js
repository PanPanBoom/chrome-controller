import { Container } from "../Container.js";
import { ShowPage } from "../ShowPage.js";

export class PreviewModalPage extends ShowPage
{
    constructor()
    {
        super([
            new Container(".previewModal--container", ".previewModal-close > span, .previewModal--player-titleTreatment a, .episodeSelector-dropdown button, .episodeSelector-dropdown li, .episode-item", "column")
        ], '.previewModal--container');
    }

    async getShow(tabId)
    {
        return (await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => document.querySelector('.about-header > h3.previewModal--section-header > strong').innerHTML
        }))[0].result;
    }
}