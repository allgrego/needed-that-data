export interface BcvRates {
    usd?: number | string | null;
    eur?: number | string | null;
    [rest: string]: number | string | null | undefined;
}

export interface BcvRatesInfo {
    currency: string;
    rates: BcvRates;
    date?: string | any;
}