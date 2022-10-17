import Reader from "./baseReader";

export default class FileSignatureReader extends Reader {
  protected readonly headerNumber = 425;
  readable(): boolean {
    return this.headerMatch(this.binary.nextBytes(8).sum());
  }
}
