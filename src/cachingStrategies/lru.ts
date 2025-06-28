import { createHash } from "node:crypto";
import LRUEvictionPolicy from "src/common/evictionPolicies/lruEviction";

class LRUCache {
    private lruCache: LRUEvictionPolicy;

    constructor(
        size: number
    ) {
        this.lruCache = new LRUEvictionPolicy(size)
    }

    set(
        key: any,
        value: any
    ) {
        const hashedKey = this.createHashedKey(key)
        this.lruCache.put(hashedKey, value)
    }

    get(key: any) {
        const hashedKey = this.createHashedKey(key)
        return this.lruCache.get(hashedKey)
    }

    createHashedKey(key: any): string {
        let newKey = key;
        if(typeof key === 'object'){
            newKey = Object.keys(key).reduce((acc,k) => {
                return acc += `${key[k]}_`
            }, "")
        }
        return createHash('sha256').update(JSON.stringify(newKey)).digest("hex")
    }
}

export default LRUCache