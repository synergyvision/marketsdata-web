export interface Company {
    id: string,
    name: string,
    symbol: string,
    sector: string,
    exchange: string,
    latestPrice: number,
    marketCap: number,
    peRatio: number,
    earningYield: number,
    returnOnAssets: number,
    returnOnEquity: number,
    ttmEps: number
}