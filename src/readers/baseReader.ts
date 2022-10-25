import { IIteratableBinary } from "../iteratableBinary";

abstract class Reader {
  protected abstract readonly headerNumber: number;
  protected binary: IIteratableBinary;
  constructor(binary: IIteratableBinary) {
    this.binary = binary;
  }
  readable(): boolean {
    return this.headerMatch(this.binary.peekBytes(8).slice(4).sum());
  }
  headerMatch(sumedBytes: Number): boolean {
    if (sumedBytes === this.headerNumber) {
      return true;
    }

    return false;
  }
}

export default Reader;
