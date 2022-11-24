import path from "path";
import PNGTest from "../PNGTest";

describe("Additional palettes", () => {
  describe("six-cube suggested palette (1 byte) in true-color image", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 1;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 16;
    test.color = 2;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 6176;

    test.parsePng(path.join(__dirname, "images", "ps1n2c16.png"), test);
  });
});
