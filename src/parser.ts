import { inject, injectable } from "inversify";
import PNGBuilder from "./builder";
import IIteratableBinary from "./IIteratableBinary";
import { TYPES } from "./types";
import PNG from "./png";
import FileSignatureReader from "./readers/fileSignatureReader";
import {
  ChunckReader,
  IHDRChunkReader,
  PLTEChunkReader,
  tRNSChunkReader,
  IDATChunkReader,
  IENDChunkReader,
  gAMAChunkReader,
} from "./readers/chunksReaders";

@injectable()
export default class Parser {
  private readonly _enumrableBinary: IIteratableBinary;
  private readonly _PNGBuilder: PNGBuilder;

  constructor(
    @inject(TYPES.IIteratableBinary) enumrableBinary: IIteratableBinary,
    @inject(TYPES.PNGBuilder) builder: PNGBuilder
  ) {
    this._enumrableBinary = enumrableBinary;
    this._PNGBuilder = builder;
  }
  parse(byets: ArrayBuffer): PNG {
    this._enumrableBinary.setInput(byets);

    this.parseFileSignature()
      .parseIHDRChunk()
      .parseAncillaryChunks()
      .parsePLTEChunk()
      .verifyPLTEChunkWithColorType()
      .parseIDATChunk()
      .parseIENDChunk();

    return this._PNGBuilder.getPNG();
  }

  private parseFileSignature(): Parser {
    const fileSignatureReader: FileSignatureReader = new FileSignatureReader();

    if (!fileSignatureReader.readable(this._enumrableBinary))
      throw Error("not a PNG file");

    return this;
  }
  private parseIHDRChunk(): Parser {
    const iHDRChunkReader = new IHDRChunkReader();

    if (!iHDRChunkReader.readable(this._enumrableBinary))
      throw Error("Couldn't Find IHDR header");

    iHDRChunkReader.readAndSetChunkLength(this._enumrableBinary);

    if (!iHDRChunkReader.chunckLengthMatch())
      throw Error("IHDR chunck length is unexpected");

    iHDRChunkReader.readAndSetChunckData(this._enumrableBinary);

    iHDRChunkReader.read(this._enumrableBinary, this._PNGBuilder);

    if (iHDRChunkReader.isChunckDataCorrupted(this._enumrableBinary))
      throw new Error("Unexpected CRC");

    return this;
  }
  private parseAncillaryChunks(): Parser {
    const ancillaryChunksReaders: ChunckReader[] = [
      new gAMAChunkReader(),
      new tRNSChunkReader(),
    ];

    for (let index = 0; index < ancillaryChunksReaders.length; index++) {
      const reader = ancillaryChunksReaders[index];

      if (reader.readable(this._enumrableBinary)) {
        reader.readAndSetChunkLength(this._enumrableBinary);
        reader.readAndSetChunckData(this._enumrableBinary);

        reader.read(
          this._enumrableBinary,
          this._PNGBuilder,
          ancillaryChunksReaders
        );

        if (reader.isChunckDataCorrupted(this._enumrableBinary))
          throw new Error("Unexpected CRC");
      }
    }
    return this;
  }
  private parsePLTEChunk(): Parser {
    const pLTERChunkReader = new PLTEChunkReader();

    if (pLTERChunkReader.readable(this._enumrableBinary)) {
      const pLTEChunkLength = this._enumrableBinary.nextBytes(4).stack();

      if (!pLTERChunkReader.isChunckLengthDivisibleByThree(pLTEChunkLength))
        throw Error("PLTE chunck length is unexpected");

      pLTERChunkReader.readAndSetChunckData(this._enumrableBinary);

      pLTERChunkReader.read(this._enumrableBinary, this._PNGBuilder);

      if (pLTERChunkReader.isChunckDataCorrupted(this._enumrableBinary))
        throw new Error("Unexpected CRC");
    }

    return this;
  }
  private verifyPLTEChunkWithColorType(): Parser {
    const png = this._PNGBuilder.getPNG();

    if (png.paletteEntries !== undefined && ![2, 3, 6].includes(png.color)) {
      throw new Error(
        "PLTE chunck should appear for only color types 2, 3 and 6"
      );
    }
    return this;
  }
  private parseIDATChunk(): Parser {
    const iDATChunkReader = new IDATChunkReader();

    while (iDATChunkReader.readable(this._enumrableBinary)) {
      iDATChunkReader.readAndSetChunkLength(this._enumrableBinary);

      iDATChunkReader.readAndSetChunckData(this._enumrableBinary);

      iDATChunkReader.read(this._enumrableBinary, this._PNGBuilder);

      if (iDATChunkReader.isChunckDataCorrupted(this._enumrableBinary))
        throw new Error("Unexpected CRC");
    }

    return this;
  }
  private parseIENDChunk(): void {
    const iENDChunkReader = new IENDChunkReader();

    if (!iENDChunkReader.readable(this._enumrableBinary))
      throw Error("Couldn't Find IEND header");

    iENDChunkReader.readAndSetChunkLength(this._enumrableBinary);

    iENDChunkReader.readAndSetChunckData(this._enumrableBinary);

    iENDChunkReader.read(this._enumrableBinary, this._PNGBuilder);

    if (iENDChunkReader.isChunckDataCorrupted(this._enumrableBinary))
      throw new Error("Unexpected CRC");
  }
}
