import path from "path";
import PNGTest from "../PNGTest";

describe("Zlib compression", () => {
  describe("color, no interlacing, compression level 0 (none)", () => {
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
    test.gamaIntensity = undefined;
    test.imageDataLength = 3104;

    test.parsePng(path.join(__dirname, "images", "z00n2c08.png"), test);
  });

  describe("color, no interlacing, compression level 3", () => {
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
    test.gamaIntensity = undefined;
    test.imageDataLength = 3104;

    test.parsePng(path.join(__dirname, "images", "z03n2c08.png"), test);
  });

  describe("color, no interlacing, compression level 6 (default)", () => {
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
    test.gamaIntensity = undefined;
    test.imageDataLength = 3104;

    test.parsePng(path.join(__dirname, "images", "z06n2c08.png"), test);
  });

  describe("color, no interlacing, compression level 9 (maximum)", () => {
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
    test.gamaIntensity = undefined;
    test.imageDataLength = 3104;

    test.parsePng(path.join(__dirname, "images", "z09n2c08.png"), test);
  });
});
