/**
 * All routes with the pattern "/v1/bcv"
 */
import { Request, Response, NextFunction, Router as expressRouter } from "express";
import { getUsdRateInVes } from "../../../controllers/bcvController";

const router = expressRouter();

// Middleware specific for these routes
router.use((req: Request, res: Response, next: NextFunction) => {
    // Not doing much for now
    next();
});

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: `Services using BCV data`,
        endpoints: [
            `/v1/bcv/rates`
        ]
    });
})

// Get current USD/EUR rates in VES according to BCV
router.get('/rates', getUsdRateInVes)

export default router;

