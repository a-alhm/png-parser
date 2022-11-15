import path from "path";
import PNGTest from "../PNGTest";

describe("Corrupted files", () => {
  describe("signature byte 1 MSBit reset to zero", () => {
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

    test.parsePng(path.join(__dirname, "images", "xs1n0g01.png"), test);
  });

  describe("signature byte 2 is a 'Q'", () => {
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

    test.parsePng(path.join(__dirname, "images", "xs2n0g01.png"), test);
  });

  describe("signature byte 4 lowercase", () => {
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

    test.parsePng(path.join(__dirname, "images", "xs4n0g01.png"), test);
  });

  describe("7th byte a space instead of control-Z", () => {
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

    test.parsePng(path.join(__dirname, "images", "xs7n0g01.png"), test);
  });

  describe("added cr bytes", () => {
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

    test.parsePng(path.join(__dirname, "images", "xcrn0g04.png"), test);
  });

  describe("added lf bytes", () => {
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

    test.parsePng(path.join(__dirname, "images", "xlfn0g04.png"), test);
  });

  describe("incorrect IHDR checksum", () => {
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

    test.parsePng(path.join(__dirname, "images", "xhdn0g08.png"), test);
  });

  describe("color type 1", () => {
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

    test.parsePng(path.join(__dirname, "images", "xc1n0g08.png"), test);
  });

  describe("color type 9", () => {
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

    test.parsePng(path.join(__dirname, "images", "xc9n2c08.png"), test);
  });

  describe("bit-depth 0", () => {
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

    test.parsePng(path.join(__dirname, "images", "xd0n2c08.png"), test);
  });

  describe("bit-depth 3", () => {
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

    test.parsePng(path.join(__dirname, "images", "xd3n2c08.png"), test);
  });

  describe("bit-depth 99", () => {
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

    test.parsePng(path.join(__dirname, "images", "xd9n2c08.png"), test);
  });

  describe("missing IDAT chunk", () => {
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

    test.parsePng(path.join(__dirname, "images", "xdtn0g01.png"), test);
  });

  describe("incorrect IDAT checksum", () => {
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

    test.parsePng(path.join(__dirname, "images", "xcsn0g01.png"), test);
  });
});
