import { Mapper } from "../Mapper.js";

export class YoutubeMapper extends Mapper
{
    constructor()
    {
        super();
        this.platform = "youtube";
    }

    carousel(video)
    {
        return super.carousel(
            video.id.videoId ?? video.id ?? video.snippet.resourceId.videoId,
            video.snippet.title,
            video.snippet.thumbnails.high.url,
            video.snippet.description
        )
    }
}