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

  describe("grayscale", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 2;
    test.color = 0;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 1;
    test.gamaIntensity = 100000;
    test.imageDataLength = 316;

    test.parsePng(path.join(__dirname, "images", "basi0g02.png"), test);
  });

  describe("rgb color", () => {
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
    test.isInterlaced = 1;
    test.gamaIntensity = 100000;
    test.imageDataLength = 6204;

    test.parsePng(path.join(__dirname, "images", "basi2c16.png"), test);
  });

  describe("paletted", () => {
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
    test.isInterlaced = 1;
    test.gamaIntensity = 100000;
    test.imageDataLength = 316;

    test.parsePng(path.join(__dirname, "images", "basi3p02.png"), test);
  });

  describe("grayscale alpha-channel", () => {
    const test = new PNGTest();

    test.suggestedPaletteLength = 0;
    test.textualDataLength = 0;
    test.compressedTextualDataLength = 0;
    test.internationalTextualDataLength = 0;
    test.width = 32;
    test.height = 32;
    test.bitDepth = 8;
    test.color = 4;
    test.compressionMethod = 0;
    test.filterMethod = 0;
    test.isInterlaced = 1;
    test.gamaIntensity = 100000;
    test.imageDataLength = 2108;

    test.parsePng(path.join(__dirname, "images", "basi4a08.png"), test);
  });

  describe("rgb color alpha-channel", () => {
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
    test.isInterlaced = 1;
    test.gamaIntensity = 100000;
    test.imageDataLength = 4156;

    test.parsePng(path.join(__dirname, "images", "basi6a08.png"), test);
  });
});
