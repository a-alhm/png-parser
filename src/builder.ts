import PNG from "./png";
import pako from "pako"

export default class PNGBuilder  {
  private _png
  constructor(){
    this._png = new PNG()
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
    this._png.ImageData.push(...data)
  }
  inflateImageData(): void {
    this._png.deflatedImageData = pako.inflate(this._png.ImageData);
  }
  setGamaIntensity(data: number): void{
    this._png.gamaIntensity = data
  }
  getPNG(): PNG {
    return this._png;
  }
}