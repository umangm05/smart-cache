import * as fs from 'fs';
import * as path from 'path'

import DLL from "../dll/dll";
import DllNode from "../dll/dllNode";
import HashMap from "../HashMap/hashMap";
import { CacheLogEntry } from 'src/types/logTypes';

interface IDllNode {
    key: string;
    value: any
}

class LRUEvictionPolicy {
    private storage: HashMap<DllNode<IDllNode>>;
    private list: DLL<IDllNode>;
    private size: number;

    LOG_PATH = path.resolve(`./src/trainingLogs/data.json`)

    constructor(
        size: number,
    ) {
        if (!size) throw new Error("Size must be greater than 0")
        this.storage = new HashMap(size)
        this.list = new DLL();
        this.size = size;
    }

    get(key: string): any {
        const node: DllNode<IDllNode> | null = this.storage.get(key)
        if (node) {
            this.list.detach(node);
        }
        if (node) this.list.attach(node.value)
        this.log({
            key,
            accessedOn: new Date(),
            evicted: false,
            cacheHit: !!node,
        })
        return node?.value;
    }

    put(
        key: string,
        value: any
    ) {
        if (this.storage.getSize() >= this.size) {
            //TODO What to evict
            this.evict()
        }
        const node = this.list.attach({ key, value })
        try {
            this.storage.put(key, node)
        } catch (e) {
            throw new Error(e)
        }
    }

    private evict() {
        const node = this.list.getHead()
        if (node) {
            this.storage.remove(node.value?.key)
            this.list.detach(node)
            this.log({
                key: node.value?.key,
                accessedOn: new Date(),
                evicted: true,
                cacheHit: false,
            })
        }
    }

    private log(entry: CacheLogEntry) {
        if (!fs.existsSync(this.LOG_PATH)) {
            fs.mkdirSync(path.dirname(this.LOG_PATH), { recursive: true });
            fs.writeFileSync(this.LOG_PATH, JSON.stringify([]));
        }
        const existingLogs = JSON.parse(fs.readFileSync(this.LOG_PATH, 'utf-8')) as CacheLogEntry[];
        existingLogs.push(entry);
        fs.writeFileSync(this.LOG_PATH, JSON.stringify(existingLogs, null, 2));
    }
}

export default LRUEvictionPolicy