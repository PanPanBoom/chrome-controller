import { Router } from "express";
import { parseToVTT } from "wyzie-lib";
import { serverLog } from "../../src/utils.js";
import webvtt from "node-webvtt";

export default function playerRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.get('/proxy-subtitles', async (req, res) => {
        serverLog('Subtitles proxy');
        try {
            const url = decodeURIComponent(req.query.url);
            const vttFile = await parseToVTT(url, {
                key: process.env.WYZIE_API_KEY
            });
            const parsedVtt = webvtt.parse(vttFile);

            serverLog(parsedVtt.cues);
            
            res.json(parsedVtt.cues);
        } catch (err) {
            res.status(500).send('Proxy subtitles error: ' + err);
        }
    });
    
    return router;
}