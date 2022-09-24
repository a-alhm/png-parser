
interface Uint8Array {
    sum(): number
    stack(): number
    packEvery(length: number): Uint8Array[]
}


Uint8Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0);
};

Uint8Array.prototype.stack = function () {
    let result = 0;
    for (let i = 0; i < this.length; i++) {
        result = result << 8
        result += this[i];
    }
    return result;
};

Uint8Array.prototype.packEvery = function (length: number) {
    var result: Uint8Array[] = []
    for (let i = 0; i < this.length; i += length) {
        result.push(this.slice(i, i + length))
    }
    return result
};
