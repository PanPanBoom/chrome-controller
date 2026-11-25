import { Mapper } from "../Mapper.js";

export class TwitchMapper extends Mapper
{
    constructor()
    {
        super();
        this.platform = "twitch";
    }

    carousel(stream)
    {
        return super.carousel(
            stream.userName,
            stream.userDisplayName,
            stream.getThumbnailUrl(1280, 720),
            stream.title
        );
    }
}