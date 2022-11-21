import path from "path";
import { createReadStream } from "fs";
import { expect } from "chai";
import parsePng from "../../index";

describe("Corrupted files", () => {
  describe("signature byte 1 MSBit reset to zero", () => {
    it("not a PNG file error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xs1n0g01.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("not a PNG file");
      });
    });
  });

  describe("signature byte 2 is a 'Q'", () => {
    it("not a PNG file error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xs2n0g01.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("not a PNG file");
      });
    });
  });

  describe("signature byte 4 lowercase", () => {
    it("not a PNG file error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xs4n0g01.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("not a PNG file");
      });
    });
  });

  describe("7th byte a space instead of control-Z", () => {
    it("not a PNG file error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xs7n0g01.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("not a PNG file");
      });
    });
  });

  describe("added cr bytes", () => {
    it("not a PNG file error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xcrn0g04.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("not a PNG file");
      });
    });
  });

  describe("added lf bytes", () => {
    it("not a PNG file error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xlfn0g04.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("not a PNG file");
      });
    });
  });

  describe("incorrect IHDR checksum", () => {
    it("Unexpected CRC error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xhdn0g08.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("Unexpected CRC");
      });
    });
  });

  describe("incorrect IDAT checksum", () => {
    it("Unexpected CRC error", () => {
      const stream = createReadStream(
        path.join(__dirname, "images", "xcsn0g01.png")
      );

      stream.on("data", (data) => {
        expect(() => parsePng(data)).to.throw("Unexpected CRC");
      });
    });
  });
});
