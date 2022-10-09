/**
 * All routes with the pattern "/v1/cne"
 */
import { Request, Response, NextFunction, Router as expressRouter } from "express";
import { getInfoByCID } from "../../../controllers/cneControllers";

const router = expressRouter();

// Middleware specific for these routes
router.use((req: Request, res: Response, next: NextFunction) => {
    // Not doing much for now
    next();
});

router.get('/', (req: Request, res: Response) => {
    res.json({
        message: `Hello from cne!`
    });
})

// Get person info by their cedula ID
router.get('/search/cid', getInfoByCID)

export default router;

