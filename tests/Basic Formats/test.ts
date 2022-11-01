import fs from "fs";
import path from "path";
import { expect } from "chai";
import parsePng from "../../index";

function parsePngTest(
  filePath,
  suggestedPaletteLength,
  textualDataLength,
  compressedTextualDataLength,
  internationalTextualDataLength,
  width,
  height,
  bitDepth,
  color,
  compressionMethod,
  filterMethod,
  isInterlaced,
  gamaIntensity,
  imageDataLength
) {
  fs.createReadStream(filePath).on("data", (data) => {
    const png = parsePng(data);
    expect(png.suggestedPalette).with.lengthOf(suggestedPaletteLength);
    expect(png.textualData).with.lengthOf(textualDataLength);
    expect(png.compressedTextualData).with.lengthOf(
      compressedTextualDataLength
    );
    expect(png.internationalTextualData).with.lengthOf(
      internationalTextualDataLength
    );
    expect(png.width).to.equal(width);
    expect(png.height).to.equal(height);
    expect(png.bitDepth).to.equal(bitDepth);
    expect(png.color).to.equal(color);
    expect(png.compressionMethod).to.equal(compressionMethod);
    expect(png.filterMethod).to.equal(filterMethod);
    expect(png.isInterlaced).to.equal(isInterlaced);
    expect(png.gamaIntensity).to.equal(gamaIntensity);
    expect(png.imageData).with.lengthOf(imageDataLength);
  });
}

describe("Basic Formats", () => {
  it("black & white", () =>
    parsePngTest(
      path.join(__dirname, "images", "basn0g01.png"),
      0,
      0,
      0,
      0,
      32,
      32,
      1,
      0,
      0,
      0,
      0,
      100000,
      160
    ));
  it("grayscale", () =>
    parsePngTest(
      path.join(__dirname, "images", "basn0g02.png"),
      0,
      0,
      0,
      0,
      32,
      32,
      2,
      0,
      0,
      0,
      0,
      100000,
      288
    ));
  it("rgb color", () =>
    parsePngTest(
      path.join(__dirname, "images", "basn2c16.png"),
      0,
      0,
      0,
      0,
      32,
      32,
      16,
      2,
      0,
      0,
      0,
      100000,
      6176
    ));
  it("paletted", () =>
    parsePngTest(
      path.join(__dirname, "images", "basn3p02.png"),
      0,
      0,
      0,
      0,
      32,
      32,
      1,
      3,
      0,
      0,
      0,
      100000,
      160
    ));
  it("grayscale alpha-channel", () => {});
  it("rgb color alpha-channel", () => {});
});
