/**
 * BCV related controller
 */

import { Request, Response } from "express";
import { HttpErrorResponse } from "../types/errors.types";
import { BcvRatesInfo } from "../utils/bcv/bcv.types";
import { getBcvRatesInVes } from "../utils/bcv/fetch";

export const getUsdRateInVes = async (req: Request, res: Response) => {

    // Standard error response
    const error: HttpErrorResponse = {
        error: {
            code: 'internal',
            message: 'INTERNAL'
        }
    }

    try {
        // Cache
        // res.set("Cache-Control", "public, max-age=1800, s-maxage=3600");

        const ratesInfo: BcvRatesInfo | undefined | 'fetching-error' = await getBcvRatesInVes()
        // Fetching error
        if (ratesInfo === 'fetching-error' || !ratesInfo) {
            error.error.code = 'internal'
            error.error.message = 'There was an error fetching the data from BCV'
            res.status(500).json(error)
            return
        }

        const { date: bcvDate, ...rest } = ratesInfo

        const now = new Date()

        res.json({
            ...rest,
            bcvDate,
            currentTimestamp: now,
        })
        return
    } catch (err) {
        console.log(err);
        res.json(error)
    }
}