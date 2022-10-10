/**
 * CNE related controllers
 */

import { Request, Response } from "express";
import { HttpErrorResponse } from "../types/errors.types";
import { getPersonByCid } from "../utils/cne/fetch";
import { PersonDataCne } from "../utils/cne/fetch.types";
import { getRifFromCid } from "../utils/cne/rif";
import { cidNumberIsValid, nationalityIsValid, parseCidNumber, parseNationality } from "../utils/cne/validations";


// Get person info by their cedula ID
export const getInfoByCID = async (req: Request, res: Response) => {
    // Standard error response
    const error: HttpErrorResponse = {
        error: {
            code: 'internal',
            message: 'INTERNAL'
        }
    }

    try {
        // Cache
        // res.set("Cache-Control", "public, max-age=30, s-maxage=60");

        const providedNationality: string | undefined = String(req.query?.nat) || undefined
        const providedNumber: string | undefined = String(req.query?.num) || undefined

        if (!nationalityIsValid(providedNationality)) {
            error.error.code = 'invalid-argument'
            error.error.message = '\'nat\' argument (nationality) is missing or invalid (must be \'V\' or \'E\')'
            res.status(400).json(error)
            return
        }

        if (!cidNumberIsValid(providedNumber)) {
            error.error.code = 'invalid-argument'
            error.error.message = '\'num\' argument (cedula number) is missing or invalid (must be in numeric format \'1234567\')'
            res.status(400).json(error)
            return
        }

        const nationality = parseNationality(providedNationality)
        const number = parseCidNumber(providedNumber)

        // Get person data from CNE API
        const person: PersonDataCne | undefined | 'fetching-error' = await getPersonByCid(nationality, number)

        // Fetching error
        if (person === 'fetching-error') {
            error.error.code = 'internal'
            error.error.message = 'There was an internal error fetching the data'
            res.status(500).json(error)
            return
        }

        // Content verification
        if (!person) {
            error.error.code = 'not-found'
            error.error.message = 'No data record was found for provided parameters'
            res.status(404).json(error)
            return
        }

        // Calculate the person RIF according to the CID
        person.rif = getRifFromCid(nationality, number)

        res.json(person)
        return
    } catch (err) {
        console.log(err);
        res.json(error)
    }
}