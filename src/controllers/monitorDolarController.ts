/**
 * MonitorDolarVzla related controller
 */

import { Request, Response } from "express";
import { HttpErrorResponse } from "../types/errors.types";
import { getMonitorLastRate, getMonitorRateHistory } from "../utils/monitor-dolar/fetch";


export const getLastUsdRate = async (req: Request, res: Response) => {

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

        const lastRate: any | undefined | 'fetching-error' = await getMonitorLastRate()


        // Fetching error
        if (lastRate === 'fetching-error' || !lastRate) {
            error.error.code = 'internal'
            error.error.message = 'There was an error fetching the data from Monitor Dolar'
            res.status(500).json(error)
            return
        }

        const { date: monitorDate, ...rest } = lastRate
        // Now timestamp in ISO format "yyyy-mm-ddTHH:mm:ss.tzZ"
        const now = new Date().toISOString()

        res.json({
            currency: 'VES',
            ...rest,
            monitorDate,
            currentTimestamp: now,
        })
        return
    } catch (err) {
        console.log(err);
        res.json(error)
    }
}


export const getUsdRateHistory = async (req: Request, res: Response) => {

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

        const rates: any | undefined | 'fetching-error' = await getMonitorRateHistory()


        // Fetching error
        if (rates === 'fetching-error' || !rates) {
            error.error.code = 'internal'
            error.error.message = 'There was an error fetching the data from Monitor Dolar'
            res.status(500).json(error)
            return
        }

        const now = new Date()

        res.json({
            currency: 'VES',
            rates,
            currentTimestamp: now,
        })
        return
    } catch (err) {
        console.log(err);
        res.json(error)
    }
}