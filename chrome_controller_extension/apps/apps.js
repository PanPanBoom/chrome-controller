import { Netflix } from "./netflix/Netflix.js";
import { Youtube } from "./youtube/Youtube.js";

export const apps = {
    youtube: new Youtube(),
    netflix: new Netflix()
}