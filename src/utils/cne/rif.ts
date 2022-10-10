import { parseCidNumber, parseNationality } from "./validations"

/**
 * Calculate the RIF according to provided Cedula and nationality
 * 
 * Based on gist: https://gist.github.com/juanvmarquezl/a299049a3acc5d201924
 * 
 * @param {string} nationality Nationality code (V, E)
 * @param {string} number Cedula number in format '123456' 
 * 
 * @return {string} calculated RIF in format 'V123456-7'
 */
export const getRifFromCid = (nationality: string, number: string) => {
    // Preprocess parameters
    nationality = parseNationality(nationality)
    const cidNumber = parseCidNumber(number)

    try {
        if (!nationality || !cidNumber) throw new Error('Invalid arguments has been provided')

        const base: Record<string, number> = {
            'V': 4,
            'E': 8,
            'J': 12,
            'P': 16,
            'G': 20
        }

        const operator = [3, 2, 7, 6, 5, 4, 3, 2]

        // Separate each digit and parse them as number
        const cidDigits: number[] = cidNumber.split('').map(d => Number(d))

        let val: number = cidDigits.reduce((storedValue, currentDigit, index) => {
            // Calculate the correspondant number for current digit
            const newValForCurrentDigit = operator[index] * parseInt(String(currentDigit), 10)
            // Add it to the total
            return storedValue + newValForCurrentDigit
        }, 0)

        // Sum the number according to nationality
        val += base[nationality]

        let digit = 11 - (val % 11)

        digit = digit < 10 ? digit : 0

        // String RIF
        const rif = `${nationality}${cidNumber}-${digit}`

        return rif
    } catch (error) {
        console.log(error);
        throw error
    }

}
