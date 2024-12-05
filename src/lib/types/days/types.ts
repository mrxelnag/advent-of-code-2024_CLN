// types.ts
export interface DayResult {
}

export interface PageResponse {
    res: DayResult | null;
    error?: string;
}