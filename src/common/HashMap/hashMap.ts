class HashMap<T> {
    private store: Record<string, T>;
    private size: number;
    private DEFAULT_SIZE = 5;

    constructor(size: number = this.DEFAULT_SIZE) {
        this.store = {};
        this.size = size;
    }

    get(key: string): T | null {
        const value = this.store[key] || null;
        return value;
    }

    put(key: string, value: T | null): Record<string, T | null> {
        if (!value) {
            this.remove(key)
            return { [key]: value }
        }
        if (Object.keys(this.store).length >= this.size) throw new Error("Map is full. Cannot insert item")
        this.store[key] = value;
        return { [key]: value };
    }

    remove(key: string) {
        delete this.store[key];
    }

    getSize() {
        return Object.keys(this.store).length;
    }
}

export default HashMap