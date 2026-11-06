import { Router } from "express";

export default function playerRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.get('/proxy-subtitles', async (req, res) => {
        serverLog('Subtitles proxy');
        try {
            const url = decodeURIComponent(req.query.url);
            const vttFile = await parseToVTT(url);
            const parsedVtt = webvtt.parse(vttFile);

            serverLog(parsedVtt.cues);
            
            res.json(parsedVtt.cues);
        } catch (err) {
            res.status(500).send('Proxy subtitles error: ' + err);
        }
    });
    
    return router;
}