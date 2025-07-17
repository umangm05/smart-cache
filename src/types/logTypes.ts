export interface CacheLog {
    frequency: number;
    timeSinceLastAccess: number;
    size?: number;
    evicted: boolean;
}

export interface CacheLogEntry {
    key: string;                      // optional, useful for grouping/patterns
    accessedOn: Date;
    // frequency: number;               // how many times accessed

    // lastAccessDelta: number;         // seconds since last access
    // timeOfDay: number;               // 0–1 normalized value (e.g., 0 = 00:00, 0.5 = 12:00, 1 = 23:59)
    // dayOfWeek: number;               // 0–6 (Sunday = 0)
    // size?: number;                   // optional: memory size in bytes
    // keyType: string;                 // optional: e.g., 'user', 'order', etc.
    // recentPattern: number[];         // recent access pattern (past 5 time buckets, e.g., [0, 2, 1, 3, 0])
    cacheHit: boolean;
    evicted: boolean;                // label — was it evicted by AI?
  }

  export interface TrainingSample {
    timeOfDay: number; // 0–1 (e.g., 14:30 → 0.604)
    dayOfWeek: number; // 0–6 (Sunday = 0)
    keyHash: number;   // hashed key to numeric bucket
    evictionWasBad: boolean; // label (target)
  }