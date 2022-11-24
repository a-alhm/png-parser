import path from "path";
import PNGTest from "../PNGTest";

describe("Basic Formats", () => {
  describe("black & white", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 1;
    test.color = 0;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 1;
    test.gamaIntensity = 100000;
    test.imageDataLength = 192;

    test.parsePng(path.join(__dirname, "images", "basi0g01.png"), test);
  });
});
