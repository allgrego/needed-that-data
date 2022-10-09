/**
 * All routes with the pattern "/v1/**"
 */
import { NextFunction, Request, Response, Router as expressRouter } from "express";
// Routes
import cneRoutes from './cne'

const router = expressRouter();

// Middleware specific for these routes
router.use((req: Request, res: Response, next: NextFunction) => {
    // Not doing much for now
    next();
});

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: `This is v1 index!`,
        endpoints: [
            "/v1/cne",
        ],
    });
})

// CNE services
router.use("/cne", cneRoutes);

export default router;

