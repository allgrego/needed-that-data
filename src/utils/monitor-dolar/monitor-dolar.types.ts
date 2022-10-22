export interface MonitorRate {
    usd?: number | string | null;
    date?: Date;
}

export interface MonitorRatesHistory {
    currency: string;
    rate: MonitorRate[];
}