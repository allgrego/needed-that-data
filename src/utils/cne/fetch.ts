import fetch from "cross-fetch"
import { parse, HTMLElement } from 'node-html-parser'
import { PersonDataCne } from "./fetch.types"
import { contentIsValid } from "./validations"


export const getPersonByCid = async (nationality: string, number: string): Promise<PersonDataCne | undefined | 'fetching-error'> => {
    /**
         * Fetch data from CNE 
         */
    const url = `http://www.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=${nationality}&cedula=${number}`

    const fetchResponse = await fetch(url)

    if (!fetchResponse.ok) return 'fetching-error'

    const textResponse = await fetchResponse.text()

    // Parse html
    const root: HTMLElement = parse(textResponse);
    // With normalized spaces
    const rawText: string = root.rawText.replace(/\s+/gmi, ' ').trim()

    // Has name verification
    if (!contentIsValid(rawText)) return undefined

    // Get name
    const name = getNameFromText(rawText)
    const state = getStateFromText(rawText)
    const municipality = getMunicipalityFromText(rawText)
    const parish = getParishFromText(rawText)

    const personData: PersonDataCne = {
        name: name || 'none',
        state,
        municipality,
        parish,
    }

    return personData
}

/**
 * Get name from raw text content
 * 
 * @param textContent 
 * @returns 
 */
export const getNameFromText = (textContent?: string) => {
    if (!textContent) return undefined

    const nameMatches = textContent.match(/\s+nombre:\s+(.+)\s+estado:\s+/gmi)

    if (!nameMatches) return undefined

    let [name] = nameMatches
    // Remove prev
    name = name.replace(/\s+nombre:\s+/gmi, '')
    // Remove post
    name = name.replace(/\s+estado:\s+/gmi, '')
    // Normalize spaces
    name = name.replace(/\s+/gmi, ' ')

    return name
}


export const getStateFromText = (textContent?: string) => {
    if (!textContent) return undefined

    const stateMatches = textContent.match(/\s+estado:\s+(.+)\s+municipio:/gmi)

    if (!stateMatches) return undefined

    let [state] = stateMatches

    // Remove prev
    state = state.replace(/\s+estado:\s+/gmi, '')
    // Remove post
    state = state.replace(/\s+municipio:/gmi, '')
    // Normalize spaces
    state = state.replace(/\s+/gmi, ' ')

    return state
}


export const getMunicipalityFromText = (textContent?: string) => {
    if (!textContent) return undefined

    const municipalityMatches = textContent.match(/\s+municipio:\<.*\>\s+(.+)\s+parroquia:/gmi)

    if (!municipalityMatches) return undefined

    let [municipality] = municipalityMatches

    // Remove prev
    municipality = municipality.replace(/\s+municipio:\<.*\>\s+/gmi, '')
    // Remove post
    municipality = municipality.replace(/\s+parroquia:/gmi, '')
    // Normalize spaces
    municipality = municipality.replace(/\s+/gmi, ' ')

    return municipality
}


export const getParishFromText = (textContent?: string) => {
    if (!textContent) return undefined

    const municipalityMatches = textContent.match(/\s+parroquia:\s+(.+)\s+centro:/gmi)

    if (!municipalityMatches) return undefined

    let [municipality] = municipalityMatches

    // Remove prev
    municipality = municipality.replace(/\s+parroquia:\s+/gmi, '')
    // Remove post
    municipality = municipality.replace(/\s+centro:/gmi, '')
    // Normalize spaces
    municipality = municipality.replace(/\s+/gmi, ' ')

    return municipality
}