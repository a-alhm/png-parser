import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "./src/types";
import { IteratableBinary, IIteratableBinary } from "./src/iteratableBinary";
import Parser from "./src/parser";
import PNGBuilder from "./src/builder";

const container = new Container();

container.bind<IIteratableBinary>(TYPES.IIteratableBinary).to(IteratableBinary);
container.bind<Parser>(TYPES.Parser).to(Parser);
container.bind<PNGBuilder>(TYPES.PNGBuilder).to(PNGBuilder);

export default container;
