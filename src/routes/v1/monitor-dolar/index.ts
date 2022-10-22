/**
 * All routes with the pattern "/v1/bcv"
 */
import { Request, Response, NextFunction, Router as expressRouter } from "express";
import { getLastUsdRate, getUsdRateHistory } from "../../../controllers/monitorDolarController";

const router = expressRouter();

// Middleware specific for these routes
router.use((req: Request, res: Response, next: NextFunction) => {
    // Not doing much for now
    next();
});

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: `Services using Monitor Dolar Vzla data`,
        endpoints: [
            "/v1/monitor-dolar/rates",
            "/v1/monitor-dolar/rates/last",
        ]
    });
})

// Get current USD rates in VES according to Monitor Dolar
router.get('/rates/last', getLastUsdRate)

// Get 10 last USD rates in VES according to Monitor Dolar
router.get('/rates', getUsdRateHistory)

export default router;

