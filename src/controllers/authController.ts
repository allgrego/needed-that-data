/**
 * Auth related controller
 */

import { Request, Response, NextFunction } from "express";
import { HttpErrorResponse } from "../types/errors.types";

export const validateMetaApiKey = async (req: Request, res: Response, next: NextFunction) => {

    // Standard error response
    const error: HttpErrorResponse = {
        error: {
            code: 'internal',
            message: 'INTERNAL'
        }
    }

    try {
        const apiKey = process.env.META_API_KEY || null
        // In case it is not set in .env
        if (!apiKey) {
            // The API is public
            next()
            return
        }
        // Get apikey query param
        const providedApiKey = req.query.apikey
        
        if (!providedApiKey) {
            error.error.code = 'unauthorized'
            error.error.message = 'An API Key is required'
            res.status(401).json(error)
            return
        }

        if (apiKey !== providedApiKey) {
            error.error.code = 'forbidden'
            error.error.message = 'The provided API Key is invalid'
            res.status(403).json(error)
            return
        }

        next()

    } catch (err) {
        console.log(err);
        res.json(error)
    }
}