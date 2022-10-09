/**
 * All routes with the pattern "/v1/**"
 */
import { Request, Response, Router as expressRouter } from "express";

const router = expressRouter();

// Middleware specific for these routes
router.use((req, res, next) => {
    // Not doing much for now
    next();
});

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: `This is v1 index!`,
    });
})

// CNE services
// router.use("/cne", cneRoutes);

export default router;

