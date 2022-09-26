import IIteratableBinary from "../IIteratableBinary";

abstract class Reader {
  protected abstract readonly headerNumber: number;
  readable(binary: IIteratableBinary): boolean {
    return this.headerMatch(binary.peekBytes(8).slice(4).sum());
  }
  headerMatch(sumedBytes: Number): boolean {
    if (sumedBytes === this.headerNumber) {
      return true;
    }

    return false;
  }
}

export default Reader;
