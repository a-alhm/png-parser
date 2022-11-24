import { createReadStream } from "fs";
import { expect } from "chai";
import parsePng from "../index";

export default class PNGTest {
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
  gamaIntensity: number | undefined;
  imageDataLength: number;

  parsePng(filePath: string, pngTest: PNGTest) {
    let png;

    before((done) => {
      const stream = createReadStream(filePath);

      stream.on("data", (data) => (png = parsePng(data)));

      stream.on("close", done);
    });

    it("suggestedPalette", () =>
      expect(png.suggestedPalette).with.lengthOf(
        pngTest.suggestedPaletteLength
      ));

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
}
