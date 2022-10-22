import fetch from "cross-fetch"
import { parse, HTMLElement } from 'node-html-parser'
import { MonitorRate } from "./monitor-dolar.types"

/**
 * Fetch the last rates in VES from Monitor Dolar Vzla webpage
 *  
 * @return {Promise<MonitorRate | undefined | 'fetching-error'>} Get rates info in VES from Monitor Dolar webpage
 */
export const getMonitorRateHistory = async (): Promise<(MonitorRate | null)[] | 'fetching-error'> => {
    try {
        /**
         * Scrap data from BCV Page
         */
        const url = `https://monitordolarvzla.com/category/promedio-del-dolar/`

        const fetchResponse = await fetch(url)

        if (!fetchResponse.ok) return 'fetching-error'

        let textResponse = await fetchResponse.text()

        // Normalize white spaces
        textResponse = textResponse.replace(/\s+/gmi, ' ')

        // Parse html
        const root: HTMLElement = parse(textResponse);

        const mainBlock: HTMLElement | null = root.getElementById("main")

        const contentWrapper: HTMLElement | null = mainBlock.querySelector('.archive-content-wrapper')

        const articles: HTMLElement[] = contentWrapper?.querySelectorAll('article') || []

        const ratesHistoryData: (MonitorRate | null)[] = articles.map((article: HTMLElement) => {
            const dateBlock = article.querySelector('.entry-title')
            const contentBlock: HTMLElement | null = article.querySelector('.entry-content')

            const dateRaw = dateBlock?.innerText
            const contentRaw = contentBlock?.innerText

            if (!dateRaw || !contentRaw) return null

            const dateMatches = dateRaw.match(/(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}\:\d{2})\s+(pm|am)/gmi)
            const contentMatches = contentRaw.match(/\d{2}\s+(pm|am)\s+bs\s+(.*)\s+por\s+1\s+/gmi)

            if (!contentMatches || !dateMatches) return null
            // Date text in format "dd/mm/yyyy HH:mm PM"
            const [dateText] = dateMatches

            const date: Date | undefined = parseMonitorDate(dateText)

            let [ratetext] = contentMatches
            // Remove pre
            ratetext = ratetext.replace(/\d{2}\s+(pm|am)\s+bs\s+/gmi, '')
            // Remove post
            ratetext = ratetext.replace(/\s+por\s+1\s+/gmi, '')
            ratetext = cleanRateStr(ratetext)

            const rate = Number(ratetext)

            const result: MonitorRate = {
                usd: rate,
                date
            }

            return result
        })
        // Clean (remove falsy values)
        const filteredRatesHistoryData: (MonitorRate | null)[] = ratesHistoryData.filter(r => Boolean(r))
        // Sort them
        filteredRatesHistoryData.sort((a: MonitorRate | null, b: MonitorRate | null) => Number(a?.date?.getTime()) - Number(b?.date?.getTime()));

        return ratesHistoryData

    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getMonitorLastRate = async (): Promise<any | undefined | 'fetching-error'> => {
    try {
        const ratesHistory = await getMonitorRateHistory()
        return ratesHistory[0]
    } catch (error) {
        return 'fetching-error'
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
 * @param {string} monitorDate Date obtained from monitor in format ("dd/mm/yyyy HH:mm PM")
 * 
 * @return {Date} parsed date as string in format 'yyyy-mm-dd'
 */
export const parseMonitorDate = (monitorDate: string): Date | undefined => {

    if (!monitorDate) return undefined

    const [dateStr] = monitorDate.trim().split(' ') as string[]
    const [day, month, year] = dateStr.split('/').map(n => Number(n)) as number[]

    const timeStrFull = monitorDate.replace(dateStr, '').trim()

    const [timeStr, amPm] = timeStrFull.split(' ')
    let [hoursStr, minutesStr] = timeStr.split(':')

    const minutes = Number(minutesStr) || 0
    let hours = Number(hoursStr) || 0

    if (amPm.toUpperCase() === 'PM' && hours < 12) hours += 12

    const date = new Date(year, month, day)
    date.setHours(hours, minutes)

    return date
}