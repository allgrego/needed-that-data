import fetch from "cross-fetch";
import { HTMLElement, parse } from "node-html-parser";

import { contentIsValid } from "./validations";

import { PersonDataCne } from "./fetch.types";

export const getPersonByCid = async (
  nationality: string,
  number: string
): Promise<PersonDataCne | undefined | "fetching-error"> => {
  const FETCHING_ERROR_CODE = "fetching-error";
  try {
    /**
     * Fetch data from CNE
     */
    const url = `http://www.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=${nationality}&cedula=${number}`;

    console.log(`Fetching from "${url}"`);

    const fetchResponse = await fetch(url);

    const textResponse = await fetchResponse.text();

    if (!fetchResponse.ok) {
      console.log("Server error response", textResponse);
      return FETCHING_ERROR_CODE;
    }

    // Parse html
    const root: HTMLElement = parse(textResponse);
    // With normalized spaces
    const rawText: string = root.rawText.replace(/\s+/gim, " ").trim();

    // Has name verification
    if (!contentIsValid(rawText)) return undefined;

    // Get name
    const name = getNameFromText(rawText);
    const state = getStateFromText(rawText);
    const municipality = getMunicipalityFromText(rawText);
    const parish = getParishFromText(rawText);

    const personData: PersonDataCne = {
      name: name || "none",
      state,
      municipality,
      parish,
    };

    return personData;
  } catch (error) {
    console.error("Failure getting a person data by their CID", error);
    return FETCHING_ERROR_CODE;
  }
};

/**
 * Get name from raw text content
 *
 * @param textContent
 * @returns
 */
export const getNameFromText = (textContent?: string) => {
  if (!textContent) return undefined;

  const nameMatches = textContent.match(/\s+nombre:\s+(.+)\s+estado:\s+/gim);

  if (!nameMatches) return undefined;

  let [name] = nameMatches;
  // Remove prev
  name = name.replace(/\s+nombre:\s+/gim, "");
  // Remove post
  name = name.replace(/\s+estado:\s+/gim, "");
  // Normalize spaces
  name = name.replace(/\s+/gim, " ");

  return name;
};

export const getStateFromText = (textContent?: string) => {
  if (!textContent) return undefined;

  const stateMatches = textContent.match(/\s+estado:\s+(.+)\s+municipio:/gim);

  if (!stateMatches) return undefined;

  let [state] = stateMatches;

  // Remove prev
  state = state.replace(/\s+estado:\s+/gim, "");
  // Remove post
  state = state.replace(/\s+municipio:/gim, "");
  // Normalize spaces
  state = state.replace(/\s+/gim, " ");

  return state;
};

export const getMunicipalityFromText = (textContent?: string) => {
  if (!textContent) return undefined;

  const municipalityMatches = textContent.match(
    /\s+municipio:\<.*\>\s+(.+)\s+parroquia:/gim
  );

  if (!municipalityMatches) return undefined;

  let [municipality] = municipalityMatches;

  // Remove prev
  municipality = municipality.replace(/\s+municipio:\<.*\>\s+/gim, "");
  // Remove post
  municipality = municipality.replace(/\s+parroquia:/gim, "");
  // Normalize spaces
  municipality = municipality.replace(/\s+/gim, " ");

  return municipality;
};

export const getParishFromText = (textContent?: string) => {
  if (!textContent) return undefined;

  const municipalityMatches = textContent.match(
    /\s+parroquia:\s+(.+)\s+centro:/gim
  );

  if (!municipalityMatches) return undefined;

  let [municipality] = municipalityMatches;

  // Remove prev
  municipality = municipality.replace(/\s+parroquia:\s+/gim, "");
  // Remove post
  municipality = municipality.replace(/\s+centro:/gim, "");
  // Normalize spaces
  municipality = municipality.replace(/\s+/gim, " ");

  return municipality;
};
