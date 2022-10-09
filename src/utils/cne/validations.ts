/**
 * Valid nationalities codes
 * 
 * Uppercase is important!
 */
export const validNationalities = ['V', 'E']

/**
 * Clean and parse a cedula number (e.g. 'V-25.234.455' is returned as '25234455')
 * 
 * @param {string} number cedula number to be parsed
 * 
 * @return {string} parsed cedula number if valid, otherwise empty string
 */
export const parseCidNumber = (number?: string): string => {
    try {
        if (!number) return ''

        // Remove any non numeric characters
        number = number.replace(/[^\w]/gmi, '')

        // Return processed Cedula number (could be an empty string)
        return number
    } catch (error) {
        console.log(error);
        throw error
    }
}

/**
 * Clean and parse a nationality code ('v' into 'V')
 * 
 * @param {string} nationality  nationality code to be parsed
 * 
 * @return {string} parsed nationality code if valid, otherwise empty string
 */
export const parseNationality = (nationality?: string): string => {
    try {
        if (!nationality) return ''

        // To upper case
        nationality = nationality.toUpperCase()

        // Return processed Cedula number (could be an empty string)
        return nationality
    } catch (error) {
        console.log(error);
        throw error
    }
}

/**
 * Verify if a nationality code is valid
 * 
 * @param {string} nationality 'v' or 'e' according to nationality
 * 
 * @return {boolean} true if it's valid, otherwise false
 */
export const nationalityIsValid = (nationality?: string): boolean => {
    try {
        if (!nationality) return false

        nationality = parseNationality(nationality)

        if (!validNationalities.includes(nationality)) return false

        return true
    } catch (error) {
        console.log(error);
        throw error
    }
}

/**
 * Verify if a cedula number is valid
 * 
 * @param {string} number cedula number
 * 
 * @return {boolean} true if it's valid, otherwise false
 */
export const cidNumberIsValid = (number?: string): boolean => {
    try {
        // Apply processing to number
        number = parseCidNumber(number)

        // Return result if number is only numeric
        return (/^\d+$/gmi).test(number)
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const contentIsValid = (textContent?: string) => {
    if (!textContent) return false
    const nameIsValid = /\s+nombre:\s+(.+)\s+estado:\s+/gmi.test(textContent)

    return nameIsValid
}