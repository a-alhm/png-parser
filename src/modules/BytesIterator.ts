import { injectable } from "inversify";

@injectable()
export default class BytesIterator {
  private input: Uint8Array;
  private currentPosition: number = -1;

  setInput(val: ArrayBuffer) {
    this.input = new Uint8Array(val);
  }
  nextByte(): number {
    return this.input[++this.currentPosition];
  }
  nextBytes(length: number): Uint8Array {
    const start = this.currentPosition + 1;
    const end = start + length;

    this.currentPosition += length;
    return this.input.slice(start, end);
  }
  hasMore(): boolean {
    return this.input[this.currentPosition + 1] !== undefined;
  }
  peek(): number {
    return this.input[this.currentPosition + 1];
  }
  peekBytes(length: number): Uint8Array {
    const start = this.currentPosition + 1;
    const end = start + length;

    return this.input.slice(start, end);
  }
}
