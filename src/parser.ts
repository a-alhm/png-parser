import { inject, injectable } from "inversify";
import PNGBuilder from "./builder";
import IIteratableBinary from "./IIteratableBinary"
import Reader from "./readers/baseReader";
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
  gAMAChunkReader
}
from "./readers/chunksReaders";

@injectable()
export default class Parser {
  private readonly _enumrableBinary: IIteratableBinary
  private readonly _PNGBuilder: PNGBuilder

  constructor(
    @inject(TYPES.IIteratableBinary) enumrableBinary: IIteratableBinary,
    @inject(TYPES.PNGBuilder) builder: PNGBuilder
  ) {
    this._enumrableBinary = enumrableBinary
    this._PNGBuilder = builder;
  }
  parse(byets: ArrayBuffer): PNG {

    this._enumrableBinary.setInput(byets)

    this.parseFileSignature()
    .parseIHDRChunk()
    .parseAncillaryChunks()
    .parsePLTEChunk()
    .verifyPLTEChunkWithColorType()
    .parseIDATChunk()
    .parseIENDChunk()

    return this._PNGBuilder.getPNG();
  }

  private parseFileSignature(): Parser{
    const fileSignatureReader : FileSignatureReader = new FileSignatureReader();
    
    if (!fileSignatureReader.readable(this._enumrableBinary))
      throw Error("not a PNG file")

    return this;
  }
  private parseIHDRChunk(): Parser{
    const iHDRChunkReader = new IHDRChunkReader()

    if(!iHDRChunkReader.readable(this._enumrableBinary))
      throw Error("Couldn't Find IHDR header")
    
    const iHDRChunkLength = this._enumrableBinary.nextBytes(4).stack();

    if(!iHDRChunkReader.isChunckLengthMatch(iHDRChunkLength))
      throw Error("IHDR chunck length is unexpected")

    iHDRChunkReader.setChunckData(this._enumrableBinary, iHDRChunkLength)

    iHDRChunkReader.read(this._enumrableBinary, this._PNGBuilder)

    if(iHDRChunkReader.isChunckDataCorrupted(this._enumrableBinary))
      throw new Error("Unexpected CRC");

    return this;
  }
  private parseAncillaryChunks(): Parser{
    
    const ancillaryChunksReaders: ChunckReader[] = [
      new gAMAChunkReader(),
      new tRNSChunkReader(),
    ];

    for (let index = 0; index < ancillaryChunksReaders.length; index++) {
      const reader = ancillaryChunksReaders[index]

      if (reader.readable(this._enumrableBinary)) {

        let chunkLength = this._enumrableBinary.nextBytes(4).stack();

        reader.setChunckData(this._enumrableBinary, chunkLength)

        reader.read(this._enumrableBinary, this._PNGBuilder, chunkLength)
          
        if(reader.isChunckDataCorrupted(this._enumrableBinary))
          throw new Error("Unexpected CRC");          
      }
    }
    return this;
  }
  private parsePLTEChunk(): Parser{
    const pLTERChunkReader = new PLTEChunkReader()

    if(pLTERChunkReader.readable(this._enumrableBinary)){

      const pLTEChunkLength = this._enumrableBinary.nextBytes(4).stack();
  
      if(!pLTERChunkReader.isChunckLengthDivisibleByThree(pLTEChunkLength))
        throw Error("PLTE chunck length is unexpected")

      pLTERChunkReader.setChunckData(this._enumrableBinary, pLTEChunkLength)

      pLTERChunkReader.read(this._enumrableBinary, this._PNGBuilder, pLTEChunkLength)
  
      if(pLTERChunkReader.isChunckDataCorrupted(this._enumrableBinary))
        throw new Error("Unexpected CRC");
    }
    
    return this;
  }
  private verifyPLTEChunkWithColorType(): Parser{
    const png = this._PNGBuilder.getPNG()
    
    if(png.paletteEntries !== undefined 
    && ![2,3,6].includes(png.color) ){
      throw new Error("PLTE chunck should appear for only color types 2, 3 and 6")
    }
    return this;
  }
  private parseIDATChunk(): Parser{
    
    return this;
  }
  private parseIENDChunk(): Parser{
    
    return this;
  }
}