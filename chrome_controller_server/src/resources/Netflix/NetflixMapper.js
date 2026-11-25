import { Mapper } from "../Mapper.js";

export class NetflixMapper extends Mapper
{
    constructor()
    {
        super();
        this.platform = "netflix";
    }

    carousel(show)
    {
        return super.carousel(
            show.tmdbId,
            "",
            show.imageSet.horizontalPoster.w1440,
            show.overview,
            show.tmdbId.split('/')[0]
        );
    }
}