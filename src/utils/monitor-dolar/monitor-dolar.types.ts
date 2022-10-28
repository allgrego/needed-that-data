export interface MonitorRate {
    usd?: number | string | null;
    date?: string;
}

export interface MonitorRatesHistory {
    currency: string;
    rate: MonitorRate[];
}