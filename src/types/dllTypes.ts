import DllNode from "src/common/dll/dllNode";

interface IDllInsert<T> {
    key: string;
    insertAfterNode: DllNode<T>
}
