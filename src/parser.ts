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
from "./readers/chunkReaders";

@injectable()
export default class Parser {
  private readonly _enumrableBinary: IIteratableBinary
  constructor(
    @inject(TYPES.IIteratableBinary) enumrableBinary: IIteratableBinary
  ) {
    this._enumrableBinary = enumrableBinary
  }
  parse(byets: ArrayBuffer): PNG {

    this._enumrableBinary.setInput(byets)

    const fileSignatureReader : Reader = new FileSignatureReader();
    
    if (!fileSignatureReader.readable(this._enumrableBinary))
      throw Error("not a PNG file")

    const chunksReaders: ChunckReader[] = [
      new IHDRChunkReader(),
      new PLTEChunkReader(),
      new gAMAChunkReader(),
      new tRNSChunkReader(),
      new IDATChunkReader(),
      new IENDChunkReader()
    ]

    const _PNGBuilder = new PNGBuilder();

    let chunkLength: number = this._enumrableBinary.nextBytes(4).stack();
    
    for (let index = 0; index < chunksReaders.length; index++) {
      const reader = chunksReaders[index]

      if (reader.readable(this._enumrableBinary)) {

          reader.setChunckData(this._enumrableBinary, chunkLength)

          reader.read(this._enumrableBinary, _PNGBuilder, chunkLength)
          
          if(reader.isChunckDataCorrupted(this._enumrableBinary))
            throw new Error("");
          
          chunkLength = this._enumrableBinary.nextBytes(4).stack();
      }
    }

    return _PNGBuilder.getPNG();
  }
}