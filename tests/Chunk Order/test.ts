import path from "path";
import PNGTest from "../PNGTest";

describe("Chunk ordering", () => {
  describe("grayscale mother image with 1 idat-chunk", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi1n0g16.png"), test);
  });

  describe("color mother image with 1 idat-chunk", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi1n2c16.png"), test);
  });

  describe("grayscale image with 2 idat-chunks", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi2n0g16.png"), test);
  });

  describe("color image with 2 idat-chunks", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi2n2c16.png"), test);
  });

  describe("grayscale image with 4 unequal sized idat-chunks", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi4n0g16.png"), test);
  });

  describe("color image with 4 unequal sized idat-chunks", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi4n2c16.png"), test);
  });

  describe("grayscale image with all idat-chunks length one", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi9n0g16.png"), test);
  });

  describe("color image with all idat-chunks length one", () => {
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

    test.parsePng(path.join(__dirname, "images", "oi9n2c16.png"), test);
  });
});
