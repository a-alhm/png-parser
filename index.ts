import { PNG } from "./src/png";
import containter from "./inversify.config";
import { TYPES } from "./src/types";
import Parser from "./src/parser";
import "./src/modules/Uint8Array";

export default function parsePng(byets): PNG {
  const png = containter.get<Parser>(TYPES.Parser);

  return png.parse(byets);
}
