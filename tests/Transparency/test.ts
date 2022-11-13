import path from "path";
import PNGTest from "../PNGTest";

describe("Transparency", () => {
  describe("transparent, black background chunk", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 4;
    test.color = 0;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 544;

    test.parsePng(path.join(__dirname, "images", "tbbn0g04.png"), test);
  });

  describe("transparent, green background chunk", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
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

    test.parsePng(path.join(__dirname, "images", "tbgn2c16.png"), test);
  });

  describe("multiple levels of transparency, 3 entries", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 2;
    test.color = 3;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = undefined;
    test.imageDataLength = 288;

    test.parsePng(path.join(__dirname, "images", "tm3n3p02.png"), test);
  });

  describe("transparent, but no background chunk", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 8;
    test.color = 3;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 1056;

    test.parsePng(path.join(__dirname, "images", "tp1n3p08.png"), test);
  });
});
