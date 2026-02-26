import { Netflix } from "./netflix/Netflix.js";
import { Youtube } from "./youtube/Youtube.js";
import { Twitch } from "./twitch/Twitch.js";

export const apps = {
    youtube: new Youtube(),
    netflix: new Netflix(),
    twitch: new Twitch()
}