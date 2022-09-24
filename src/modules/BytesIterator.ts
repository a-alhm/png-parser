import { injectable } from "inversify";

@injectable()
export default class BytesIterator {
    private _input: Uint8Array;
    private _currentPosition: number = -1;

    get currentPosition() {
        return this._currentPosition;
    }

    setInput(val: ArrayBuffer) {
        this._input = new Uint8Array(val);
    }
    nextByte(): number {
        return this._input[++this._currentPosition]
    }
    nextBytes(length: number): Uint8Array {
        const start = this._currentPosition + 1
        const end = start + length

        this._currentPosition += length
        return this._input.slice(start, end)
    }
    hasMore(): boolean {
        return this._input[this._currentPosition + 1] !== undefined
    }
    peek(): number {
        return this._input[this._currentPosition + 1]
    }
    peekBytes(length: number): Uint8Array {
        const start = this._currentPosition + 1
        const end = start + length

        return this._input.slice(start, end)
    }
}