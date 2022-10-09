import { Router as ExpressRouter, Request, Response } from "express";
import { HttpErrorResponse } from "../types/errors.types";
import v1Routes from './v1'

/**
 * All routes configuration
 */
const router = ExpressRouter()

// Middleware specific for all routes
router.use((req, res, next) => {
    // Not much for now
    next();
});

// Index
router.get("/", (req: Request, res: Response) => {
    const name = req.query.name ?? "World";
    res.json({
        message: `Hello, ${name}!`,
        exampleEndpoints: [
            "/v1/",
            "/v1/cne",
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
