import path from "path";
import PNGTest from "../PNGTest";

describe("Gamma values", () => {
  describe("color, file-gamma = 0.35", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 8;
    test.color = 2;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = 35000;
    test.imageDataLength = 3104;

    test.parsePng(path.join(__dirname, "images", "g03n2c08.png"), test);
  });

  describe("grayscale, file-gamma = 1.00", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 16;
    test.color = 0;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 2080;

    test.parsePng(path.join(__dirname, "images", "g10n0g16.png"), test);
  });

  describe("paletted, file-gamma = 2.50", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 4;
    test.color = 3;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = 250000;
    test.imageDataLength = 544;

    test.parsePng(path.join(__dirname, "images", "g25n3p04.png"), test);
  });
});
