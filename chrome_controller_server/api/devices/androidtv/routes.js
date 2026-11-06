import { Router } from "express";
import pairingRoutes from "./pairing/routes.js";

export default function androidTVRoutes(io)
{
    const router = new Router({ mergeParams: true });

    router.use('/pairing', pairingRoutes(io));
    
    return router;
}