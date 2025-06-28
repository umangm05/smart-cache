class HashMap<T> {
    private store: Record<string, T>;
    private size: number;
    private DEFAULT_SIZE = 5;

    constructor(size: number = this.DEFAULT_SIZE) {
        this.store = {};
        this.size = size;
    }

    get(key: string): T | null {
        console.log("🚀 ~ HashMap<T> ~ get ~ key:", key, this.store)
        const value = this.store[key] || null;
        return value;
    }

    put(key: string, value: T | null): Record<string, T | null> {
        console.log("🚀 ~ HashMap<T> ~ put ~ key:", key, this.store)
        if (!value) {
            this.remove(key)
            return { [key]: value }
        }
        if (Object.keys(this.store).length >= this.size) throw new Error("Map is full. Cannot insert item")
        this.store[key] = value;
        return { [key]: value };
    }

    remove(key: string) {
        console.log("🚀 ~ HashMap<T> ~ remove ~ key:", key, this.store)
        delete this.store[key];
    }

    getSize() {
        return Object.keys(this.store).length;
    }
}

export default HashMap