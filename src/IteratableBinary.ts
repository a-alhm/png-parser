import { injectable } from "inversify";
import BytesIterator from "./modules/BytesIterator";
import IIteratableBinary from "./IIteratableBinary";

@injectable()
export default class IteratableBinary
  extends BytesIterator
  implements IIteratableBinary {}
