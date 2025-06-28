import DLL from "../dll/dll";
import DllNode from "../dll/dllNode";
import HashMap from "../HashMap/hashMap";

interface IDllNode {
    key: string;
    value: any
}

class LRUEvictionPolicy {
    private storage: HashMap<DllNode<IDllNode>>;
    private list: DLL<IDllNode>;
    private size: number;

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
        const node = this.list.attach({key, value})
        console.log("🚀 ~ LRUEvictionPolicy ~ node:", node?.value)
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
        }
    }
}

export default LRUEvictionPolicy