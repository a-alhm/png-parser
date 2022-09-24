import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./src/types";
import IteratableBinary from "./src/modules/IteratableBinary";
import IIteratableBinary from "./src/IIteratableBinary";
import Parser from "./src/parser"

const container = new Container();

container.bind<IIteratableBinary>(TYPES.IIteratableBinary).to(IteratableBinary);
container.bind<Parser>(TYPES.Parser).to(Parser);

export default container 