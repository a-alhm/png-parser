import Reader from "./baseReader";
import IIteratableBinary from "../IIteratableBinary";

export default class FileSignatureReader extends Reader {
    protected readonly headerNumber = 425;
    readable(binary: IIteratableBinary): boolean {
        return this.headerMatch(binary.nextBytes(8).sum());
    }
}
