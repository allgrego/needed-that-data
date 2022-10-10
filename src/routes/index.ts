import { Router as ExpressRouter, Request, Response, NextFunction } from "express";
import { HttpErrorResponse } from "../types/errors.types";
import v1Routes from './v1'

/**
 * All routes configuration
 */
const router = ExpressRouter()

// Middleware specific for these routes
router.use((req: Request, res: Response, next: NextFunction) => {
    // Not doing much for now
    next();
});

// Index
router.get("/", (req: Request, res: Response) => {
    const name = req.query.name ?? "user";

    res.json({
        message: `Hello, ${name}! Welcome`,
        version: process.env.APP_VERSION || 1,
        providers: [
            "CNE",
        ],
        exampleEndpoints: [
            "/v1/cne/search/cid?nat=v&num=25234455",
            "/v1/cne/search/cid?nat=v&num=25234456",
        ],
    });
});

// Version 1 routes
router.use("/v1", v1Routes);

// Fallback (404)
router.get("**", (req: Request, res: Response) => {
    const errorResponse: HttpErrorResponse = { error: { code: "not-found", message: "Invalid route" } }
    res.status(404).json(errorResponse)
});

export default router;
