import { Page } from "../Page.js";
import { Container } from "../Container.js";

export class TwitchPage extends Page
{
    constructor(containers, identifier)
    {
        super([
            new Container("#side-nav", "a, [data-a-target*='side-nav-show']", "column"),
            new Container("body", "input[autocomplete='twitch-nav-search']", "row")
        ], identifier);
        
        this.containers = this.containers.concat(containers);
    }
}