import fetch from "cross-fetch"
import { parse, HTMLElement } from 'node-html-parser'
import { BcvRates, BcvRatesInfo } from "./bcv.types"

/**
 * Fetch the rates in VES from BCV webpage
 *  
 * @return {Promise<BcvRatesInfo | undefined | 'fetching-error'>} Get rates info in VES from BCV webpage
 */
export const getBcvRatesInVes = async (): Promise<BcvRatesInfo | undefined | 'fetching-error'> => {
    try {
        /**
     * Scrap data from BCV Page
     */
        const url = `https://bcv.org.ve/`

        const fetchResponse = await fetch(url)

        if (!fetchResponse.ok) return 'fetching-error'

        let textResponse = await fetchResponse.text()

        // Normalize white spaces
        textResponse = textResponse.replace(/\s+/gmi, ' ')

        // Parse html
        const root: HTMLElement = parse(textResponse);

        const dollarBlock = root.getElementById("dolar")
        const allRatesBlock = dollarBlock.parentNode

        /**
         * USD
         */
        let usdStr: string = cleanRateStr(dollarBlock.text || '')
        // Parse to number ()
        const usd = Number(usdStr) || null

        /**
         * EUR
         */
        let eurStr: string = cleanRateStr(allRatesBlock.getElementById("euro").text || '')
        // Parse to number ()
        const eur = Number(eurStr) || null

        /**
         * BCV Date
         */
        const dateBlock = allRatesBlock.querySelector('.pull-right')
        const dateStr = dateBlock?.querySelector('span')?.text || ''
        const date = parseBcvDate(dateStr)

        // All rates
        const rates: BcvRates = {
            usd,
            eur
        }

        const ratesInfo: BcvRatesInfo = {
            currency: 'VES',
            rates,
            date,
        }

        return ratesInfo
    } catch (error) {
        console.log(error);
        throw error
    }
}

/**
 * 
 * @param {string} rateStr Rate string obtained from BCV scrapping (e.g. ' USD 8,43434  ')
 * 
 * @return {string} cleaned rate as compatible string (e.g '8.43434')
 */
export const cleanRateStr = (rateStr: string): string => {
    // Clean the string
    return rateStr
        // Remove any character except for numbers and numbers and commas
        .replace(/[^(\d|\,)]/gmi, '')
        // Replace commas with dots
        .replace(',', '.')
}

/**
 * 
 * @param {string} bcvDate Date obtained from BCV in format (' Martes, 22 Octubre 2022 ')
 * 
 * @return {string} parsed date as string in format 'yyyy-mm-dd'
 */
export const parseBcvDate = (bcvDate: string): string | undefined => {

    if (!bcvDate) return undefined

    const monthsNumber: Record<string, number> = {
        'enero': 1,
        'febrero': 2,
        'marzo': 3,
        'abril': 4,
        'mayo': 5,
        'junio': 6,
        'julio': 7,
        'agosto': 8,
        'septiembre': 9,
        'octubre': 10,
        'noviembre': 11,
        'diciembre': 12,
    }
    // Remove day
    bcvDate = bcvDate.trim().replace(/(.*)\,\s+/gmi, '')

    let [day, monthEs, year] = bcvDate.trim().split(' ')

    // Get month number
    const month = monthsNumber[monthEs.toLowerCase()]
        .toString()
        .padStart(2, '0')

    return `${year}-${month}-${day}`
}