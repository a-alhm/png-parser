import { injectable } from "inversify";
import BytesIterator from "./BytesIterator"
import IIteratableBinary from "../IIteratableBinary"

@injectable()
export default class IteratableBinary extends BytesIterator implements IIteratableBinary { }
