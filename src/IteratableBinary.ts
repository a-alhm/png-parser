import { injectable } from "inversify";
import BytesIterator from "./modules/BytesIterator";

export interface IIteratableBinary {
  setInput(val): void;
  nextByte(): number;
  nextBytes(length: number): Uint8Array;
  hasMore(): boolean;
  peekBytes(length: number): Uint8Array;
  peek(): number;
}
@injectable()
export class IteratableBinary
  extends BytesIterator
  implements IIteratableBinary {}
