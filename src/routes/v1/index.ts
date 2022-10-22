/**
 * All routes with the pattern "/v1/**"
 */
import { Request, Response, Router as expressRouter } from "express";
import { validateMetaApiKey } from "../../controllers/authController";
// Routes
import cneRoutes from './cne'
import bcvRoutes from './bcv'
import monitorDolarRoutes from './monitor-dolar'

const router = expressRouter();

// Middleware specific for these routes
router.use(validateMetaApiKey);

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: `This is v1 index!`,
        baseEndpoints: [
            "/v1/cne",
            "/v1/bcv",
            "/v1/monitor-dolar",
        ],
    });
})

// CNE services
router.use("/cne", cneRoutes);

// BCV services
router.use("/bcv", bcvRoutes);

// Monitor Dolar Vzla services
router.use("/monitor-dolar", monitorDolarRoutes);

export default router;

