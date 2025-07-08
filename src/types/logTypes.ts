export interface CacheLog {
    frequency: number;
    timeSinceLastAccess: number;
    size?: number;
    evicted: boolean;
}