import fs from "fs";
import path from "path";
import { expect } from "chai";
import parsePng from "../../index";

describe("Basic Formats", () => {
  it("black & white", () => {
    fs.createReadStream(path.join(__dirname, "images", "basn0g01.png")).on(
      "data",
      (data) => {
        const png = parsePng(data);
        expect(png.suggestedPalette).with.lengthOf(0);
        expect(png.textualData).with.lengthOf(0);
        expect(png.compressedTextualData).with.lengthOf(0);
        expect(png.internationalTextualData).with.lengthOf(0);
        expect(png.width).to.equal(32);
        expect(png.height).to.equal(32);
        expect(png.bitDepth).to.equal(1);
        expect(png.color).to.equal(0);
        expect(png.compressionMethod).to.equal(0);
        expect(png.filterMethod).to.equal(0);
        expect(png.isInterlaced).to.equal(0);
        expect(png.gamaIntensity).to.equal(100000);
        expect(png.imageData).with.lengthOf(160);
      }
    );
  });
  it("grayscale", () => {});
  it("rgb color", () => {});
  it("paletted", () => {});
  it("grayscale alpha-channel", () => {});
  it("rgb color alpha-channel", () => {});
});
