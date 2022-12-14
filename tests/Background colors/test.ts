import path from "path";
import PNGTest from "../PNGTest";

describe("Background colors", () => {
  describe("bits rgb color, alpha, white background chunk", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 8;
    test.color = 6;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 4128;

    test.parsePng(path.join(__dirname, "images", "bgwn6a08.png"), test);
  });
});
