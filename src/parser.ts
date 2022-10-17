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
    const fileSignatureReader: FileSignatureReader = new FileSignatureReader(
      this._enumrableBinary
    );

    if (!fileSignatureReader.readable()) throw Error("not a PNG file");

    return this;
  }
  private parseIHDRChunk(): Parser {
    const iHDRChunkReader = new IHDRChunkReader(this._enumrableBinary);

    if (!iHDRChunkReader.readable()) throw Error("Couldn't Find IHDR header");

    iHDRChunkReader.readAndSetChunkLength();

    if (!iHDRChunkReader.chunckLengthMatch())
      throw Error("IHDR chunck length is unexpected");

    iHDRChunkReader.readAndSetChunckData();

    iHDRChunkReader.read(this._PNGBuilder);

    if (iHDRChunkReader.isChunckDataCorrupted())
      throw new Error("Unexpected CRC");

    return this;
  }
  private parseAncillaryChunks(): Parser {
    const ancillaryChunksReaders: ChunckReader[] = [
      new gAMAChunkReader(this._enumrableBinary),
      new tRNSChunkReader(this._enumrableBinary),
    ];

    for (let index = 0; index < ancillaryChunksReaders.length; index++) {
      const reader = ancillaryChunksReaders[index];

      if (reader.readable()) {
        reader.readAndSetChunkLength();
        reader.readAndSetChunckData();

        reader.read(this._PNGBuilder, ancillaryChunksReaders);

        if (reader.isChunckDataCorrupted()) throw new Error("Unexpected CRC");
      }
    }
    return this;
  }
  private parsePLTEChunk(): Parser {
    const pLTERChunkReader = new PLTEChunkReader(this._enumrableBinary);

    if (pLTERChunkReader.readable()) {
      pLTERChunkReader.readAndSetChunkLength();

      if (!pLTERChunkReader.chunckLengthDivisibleByThree())
        throw Error("PLTE chunck length is unexpected");

      pLTERChunkReader.readAndSetChunckData();

      pLTERChunkReader.read(this._PNGBuilder);

      if (pLTERChunkReader.isChunckDataCorrupted())
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
    const iDATChunkReader = new IDATChunkReader(this._enumrableBinary);

    while (iDATChunkReader.readable()) {
      iDATChunkReader.readAndSetChunkLength();

      iDATChunkReader.readAndSetChunckData();

      iDATChunkReader.read(this._PNGBuilder);

      if (iDATChunkReader.isChunckDataCorrupted())
        throw new Error("Unexpected CRC");
    }

    return this;
  }
  private parseIENDChunk(): void {
    const iENDChunkReader = new IENDChunkReader(this._enumrableBinary);

    if (!iENDChunkReader.readable()) throw Error("Couldn't Find IEND header");

    iENDChunkReader.readAndSetChunkLength();

    iENDChunkReader.readAndSetChunckData();

    iENDChunkReader.read(this._PNGBuilder);

    if (iENDChunkReader.isChunckDataCorrupted())
      throw new Error("Unexpected CRC");
  }
}
