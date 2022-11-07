import { createReadStream } from "fs";
import path from "path";
import { expect } from "chai";
import parsePng from "../../index";

class PNGTest {
  suggestedPaletteLength: number;
  textualDataLength: number;
  compressedTextualDataLength: number;
  internationalTextualDataLength: number;
  width: number;
  height: number;
  bitDepth: number; // convert to enum
  color: number; // convert to enum
  compressionMethod: number; // convert to enum
  filterMethod: number; // convert to enum
  isInterlaced: number; // convert to boolean
  gamaIntensity: number;
  imageDataLength: number;
}

function parsePngTest(filePath: string, pngTest: PNGTest) {
  let png;

  before((done) => {
    const stream = createReadStream(filePath);

    stream.on("data", (data) => (png = parsePng(data)));

    stream.on("close", done);
  });

  it("suggestedPalette", () =>
    expect(png.suggestedPalette).with.lengthOf(pngTest.suggestedPaletteLength));

  it("textualData", () =>
    expect(png.textualData).with.lengthOf(pngTest.textualDataLength));

  it("compressedTextualData", () =>
    expect(png.compressedTextualData).with.lengthOf(
      pngTest.compressedTextualDataLength
    ));

  it("internationalTextualData", () =>
    expect(png.internationalTextualData).with.lengthOf(
      pngTest.internationalTextualDataLength
    ));

  it("imageData", () =>
    expect(png.imageData).with.lengthOf(pngTest.imageDataLength));

  it("width", () => expect(png.width).to.equal(pngTest.width));

  it("height", () => expect(png.height).to.equal(pngTest.height));

  it("bitDepth", () => expect(png.bitDepth).to.equal(pngTest.bitDepth));

  it("color", () => expect(png.color).to.equal(pngTest.color));

  it("compressionMethod", () =>
    expect(png.compressionMethod).to.equal(pngTest.compressionMethod));

  it("filterMethod", () =>
    expect(png.filterMethod).to.equal(pngTest.filterMethod));

  it("isInterlaced", () =>
    expect(png.isInterlaced).to.equal(pngTest.isInterlaced));

  it("gamaIntensity", () =>
    expect(png.gamaIntensity).to.equal(pngTest.gamaIntensity));
}

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
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 160;

    parsePngTest(path.join(__dirname, "images", "basn0g01.png"), test);
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
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 288;

    parsePngTest(path.join(__dirname, "images", "basn0g02.png"), test);
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
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 6176;

    parsePngTest(path.join(__dirname, "images", "basn2c16.png"), test);
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
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 288;

    parsePngTest(path.join(__dirname, "images", "basn3p02.png"), test);
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
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 2080;

    parsePngTest(path.join(__dirname, "images", "basn4a08.png"), test);
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
    test.isInterlaced = 0;
    test.gamaIntensity = 100000;
    test.imageDataLength = 4128;

    parsePngTest(path.join(__dirname, "images", "basn6a08.png"), test);
  });
});
