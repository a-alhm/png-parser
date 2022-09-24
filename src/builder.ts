import PNG from "./png";
import pako from "pako"

export default class PNGBuilder  {
  private _png
  private _InflatedImageData: Array<number>;

  constructor(){
    this._png = new PNG()
    this._InflatedImageData = [];
  }
  
  setWidth(width: number): void {
    this._png.width = width;
  }
  setHeight(height: number): void {
    this._png.height = height
  }
  setBitDepth(bitDepth: number): void {
    this._png.bitDepth = bitDepth
  }
  setColor(color: number): void {
    this._png.color = color
  }
  setCompressionMethod(method: number): void {
    this._png.compressionMethod = method
  }
  setFilterMethod(method: number): void {
    this._png.filterMethod = method
  }
  setPaletteEntries(entries: Uint8Array[]): void {
    this._png.paletteEntries = entries;
  }
  setPaletteEntriesTransparency(entries: Uint8Array): void {
    this._png.paletteEntriesTransparency = entries;
  }
  setIsInterlaced(isInterlaced: number): void {
    this._png.isInterlaced = isInterlaced;
  }
  pushImageData(data: Uint8Array): void {
    this._InflatedImageData.push(...data)
  }
  inflateImageData(): void {
    this._png.ImageData = pako.inflate(this._InflatedImageData);
  }
  setGamaIntensity(data: number): void{
    this._png.gamaIntensity = data
  }
  getPNG(): PNG {
    return this._png;
  }
}