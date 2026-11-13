export class Credit
{
    static getApparitions(rawTMDBData)
    {
        return (rawTMDBData.media?.seasons?.map(season => season.episode_count)?.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + rawTMDBData.media?.episodes?.length) ?? null;
    }
}