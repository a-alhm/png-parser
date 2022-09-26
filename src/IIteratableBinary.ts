export default interface IIteratableBinary {
  setInput(val): void;
  nextByte(): number;
  nextBytes(length: number): Uint8Array;
  hasMore(): boolean;
  peekBytes(length: number): Uint8Array;
  peek(): number;
}
