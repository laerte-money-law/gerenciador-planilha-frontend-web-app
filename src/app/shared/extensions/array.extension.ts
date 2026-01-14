declare global {
    interface Array<T> {
        first(): T;
        last(): T;
        isEmtpy(): boolean;
    }
}

Array.prototype.first = function () {
    return this[0];
};
Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.isEmtpy = function () {
    return this.length === 0;
};

export {};
