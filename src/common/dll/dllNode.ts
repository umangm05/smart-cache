class DllNode<T> {
    value: T;
    prev: DllNode<T> | null = null;
    next: DllNode<T> | null = null;

    constructor(value: T) {
        this.value = value
    }
}

export default DllNode