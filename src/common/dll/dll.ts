import DllNode from "./dllNode";

class DLL<T> {
    private head: DllNode<T> | null = null;
    private tail: DllNode<T> | null;

    constructor(value?: T) {
        if (!value) return;
        const node = new DllNode(value);
        this.head = node;
        this.tail = node;
    }

    attach(
        value: T,
        insertAfterNode: DllNode<T> | null = this.tail
    ): DllNode<T> {
        const node = new DllNode(value);
        const nextNode = insertAfterNode?.next || null;
        if (insertAfterNode) {
            insertAfterNode.next = node;
            node.prev = insertAfterNode;
            node.next = nextNode;
            if (nextNode) nextNode.prev = node;
            if (!nextNode) this.tail = node;
        } else {
            if (this.head) this.head.prev = node;
            node.next = this.head;
            this.head = node;
            if (!insertAfterNode) this.tail = node;
        }
        return node;
    }

    detach(node: DllNode<T>): DllNode<T> {
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;
        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;
        node.prev = node.next = null;
        return node;
    }

    find(value: string): DllNode<T> | null {
        let current = this.head;
        if (current == null) return null;
        while (current.next !== null) {
            if (current.value === value) return current;
            current = current?.next;
        }
        return null;
    }

    getHead(): DllNode<T> | null {
        return this.head;
    }
}

export default DLL