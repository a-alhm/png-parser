import PNG from "./png";
import pako from "pako"
import { injectable } from "inversify";

@injectable()
export default class PNGBuilder  {
  private _png
  private _InflatedImageData: Array<number>;

  constructor(){
    this._png = new PNG()
    this._InflatedImageData = [];
  }
  
  setWidth(width: number): PNGBuilder {
    this._png.width = width;
    return this;
  }
  setHeight(height: number): PNGBuilder {
    this._png.height = height
    return this;
  }
  setBitDepth(bitDepth: number): PNGBuilder {
    this._png.bitDepth = bitDepth
    return this;
  }
  setColor(color: number): PNGBuilder {
    this._png.color = color
    return this;
  }
  setCompressionMethod(method: number): PNGBuilder {
    this._png.compressionMethod = method
    return this;
  }
  setFilterMethod(method: number): PNGBuilder {
    this._png.filterMethod = method
    return this;
  }
  setPaletteEntries(entries: Uint8Array[]): PNGBuilder {
    this._png.paletteEntries = entries;
    return this;
  }
  setPaletteEntriesTransparency(entries: Uint8Array): PNGBuilder {
    this._png.paletteEntriesTransparency = entries;
    return this;
  }
  setIsInterlaced(isInterlaced: number): PNGBuilder {
    this._png.isInterlaced = isInterlaced;
    return this;
  }
  pushImageData(data: Uint8Array): PNGBuilder {
    this._InflatedImageData.push(...data)
    return this;
  }
  inflateImageData(): PNGBuilder {
    this._png.ImageData = pako.inflate(this._InflatedImageData);
    return this;
  }
  setGamaIntensity(data: number): PNGBuilder{
    this._png.gamaIntensity = data
    return this;
  }
  getPNG(): PNG {
    return this._png;
  }
}