import fs from "fs";
import path from "path";
import { expect } from "chai";
import parsePng from "../../index";
import PNG from "../../src/png";

describe("Basic Formats", () => {
  it("black & white", () => {
    fs.createReadStream(path.join(__dirname, "images", "basn0g01.png")).on(
      "data",
      (data) => {
        const png = parsePng(data);
        expect(png).instanceOf(PNG);
      }
    );
  });
  it("grayscale", () => {});
  it("rgb color", () => {});
  it("paletted", () => {});
  it("grayscale alpha-channel", () => {});
  it("rgb color alpha-channel", () => {});
});
