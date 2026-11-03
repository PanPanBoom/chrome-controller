import { Show } from "./Show.js";
import { dateParser } from "../../utils.js";
import { serverLog } from "../../utils.js";

export class Movie extends Show
{
    static async buildData(tmdbId, rawTMDBData, tmdbApi)
    {
        serverLog("Building movie data for:", tmdbId);
        const data = await Show.buildData(tmdbId, rawTMDBData, tmdbApi);
        serverLog(data);
        return {
            ...data,
            title: rawTMDBData.title,
            release_date: dateParser(rawTMDBData.release_date),
            runtime: rawTMDBData.runtime,
            director: rawTMDBData?.credits?.crew?.filter(crewMember => crewMember.job === "Director")?.map(director => director.name)?.join(', ')
        };
    }
}