import { inject, injectable } from "inversify";
import PNGBuilder from "./builder";
import { IIteratableBinary } from "./iteratableBinary";
import { TYPES } from "./types";
import { PNG } from "./png";
import FileSignatureReader from "./readers/fileSignatureReader";
import {
  ChunckReader,
  IHDRChunkReader,
  PLTEChunkReader,
  tRNSChunkReader,
  IDATChunkReader,
  IENDChunkReader,
  gAMAChunkReader,
  tIMEChunkReader,
  zTXtChunkReader,
  tEXtChunkReader,
  iTXtChunkReader,
  pHYsChunkReader,
  sPLTChunkReader,
  iCCPChunkReader,
  sRGBChunkReader,
  sBITChunkReader,
  cHRMChunkReader,
  bKGDChunkReader,
  hISTChunkReader,
} from "./readers/chunksReaders";

@injectable()
export default class Parser {
  private readonly iteratableBinary: IIteratableBinary;
  private readonly pngBuilder: PNGBuilder;

  constructor(
    @inject(TYPES.IIteratableBinary) iteratableBinary: IIteratableBinary,
    @inject(TYPES.PNGBuilder) builder: PNGBuilder
  ) {
    this.iteratableBinary = iteratableBinary;
    this.pngBuilder = builder;
  }
  parse(byets: ArrayBuffer): PNG {
    this.iteratableBinary.setInput(byets);

    this.parseFileSignature()
      .parseIHDRChunk()
      .parseAncillaryChunks([
        new gAMAChunkReader(this.iteratableBinary),
        new tIMEChunkReader(this.iteratableBinary),
        new zTXtChunkReader(this.iteratableBinary),
        new tEXtChunkReader(this.iteratableBinary),
        new iTXtChunkReader(this.iteratableBinary),
        new pHYsChunkReader(this.iteratableBinary),
        new sPLTChunkReader(this.iteratableBinary),
        new iCCPChunkReader(this.iteratableBinary),
        new sRGBChunkReader(this.iteratableBinary),
        new sBITChunkReader(this.iteratableBinary),
        new cHRMChunkReader(this.iteratableBinary),
      ])
      .parsePLTEChunk()
      .verifyPLTEChunkWithColorType()
      .parseAncillaryChunks([
        new tRNSChunkReader(this.iteratableBinary),
        new bKGDChunkReader(this.iteratableBinary),
        new hISTChunkReader(this.iteratableBinary),
      ])
      .parseIDATChunk()
      .parseIENDChunk();

    return this.pngBuilder.getPNG();
  }

  private parseFileSignature(): Parser {
    const fileSignatureReader: FileSignatureReader = new FileSignatureReader(
      this.iteratableBinary
    );

    if (!fileSignatureReader.readable()) throw Error("not a PNG file");

    return this;
  }
  private parseIHDRChunk(): Parser {
    const iHDRChunkReader = new IHDRChunkReader(this.iteratableBinary);

    if (!iHDRChunkReader.readable()) throw Error("Couldn't Find IHDR header");

    iHDRChunkReader.readAndSetChunkLength();

    if (!iHDRChunkReader.chunckLengthMatch())
      throw Error("IHDR chunck length is unexpected");

    iHDRChunkReader.readAndSetChunckData();

    iHDRChunkReader.read(this.pngBuilder);

    if (iHDRChunkReader.isChunckDataCorrupted())
      throw new Error("Unexpected CRC");

    return this;
  }
  private parseAncillaryChunks(ancillaryChunksReaders: ChunckReader[]): Parser {
    for (let index = 0; index < ancillaryChunksReaders.length; index++) {
      const reader = ancillaryChunksReaders[index];

      if (reader.readable()) {
        reader.readAndSetChunkLength();
        reader.readAndSetChunckData();

        reader.read(this.pngBuilder, ancillaryChunksReaders);

        if (reader.isChunckDataCorrupted())
          throw new Error(
            "Unexpected CRC" + " Reader: " + reader.constructor.name
          );
      }
    }
    return this;
  }
  // DO WE HAVE TO THROW AN ERROR IF THE CHUNCK IS OPITIONAL?
  private parsePLTEChunk(): Parser {
    const pLTERChunkReader = new PLTEChunkReader(this.iteratableBinary);

    if (pLTERChunkReader.readable()) {
      pLTERChunkReader.readAndSetChunkLength();

      if (!pLTERChunkReader.chunckLengthDivisibleByThree())
        throw Error("PLTE chunck length is unexpected");

      pLTERChunkReader.readAndSetChunckData();

      pLTERChunkReader.read(this.pngBuilder);

      if (pLTERChunkReader.isChunckDataCorrupted())
        throw new Error("Unexpected CRC");
    }

    return this;
  }
  private verifyPLTEChunkWithColorType(): Parser {
    const png = this.pngBuilder.getPNG();

    if (png.paletteEntries !== undefined && ![2, 3, 6].includes(png.color)) {
      throw new Error(
        "PLTE chunck should appear for only color types 2, 3 and 6"
      );
    }
    return this;
  }
  private parseIDATChunk(): Parser {
    const iDATChunkReader = new IDATChunkReader(this.iteratableBinary);

    while (iDATChunkReader.readable()) {
      iDATChunkReader.readAndSetChunkLength();

      iDATChunkReader.readAndSetChunckData();

      iDATChunkReader.read(this.pngBuilder);

      if (iDATChunkReader.isChunckDataCorrupted())
        throw new Error("Unexpected CRC");
    }

    return this;
  }
  private parseIENDChunk(): void {
    const iENDChunkReader = new IENDChunkReader(this.iteratableBinary);

    if (!iENDChunkReader.readable()) throw Error("Couldn't Find IEND header");

    iENDChunkReader.readAndSetChunkLength();

    iENDChunkReader.readAndSetChunckData();

    iENDChunkReader.read(this.pngBuilder);

    if (iENDChunkReader.isChunckDataCorrupted())
      throw new Error("Unexpected CRC");
  }
}
