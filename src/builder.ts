import { PNG, SuggestedPalette } from "./png";
import pako from "pako";
import { injectable } from "inversify";

@injectable()
export default class PNGBuilder {
  private png: PNG;
  private InflatedImageData: Array<number>;

  constructor() {
    this.png = new PNG();
    this.InflatedImageData = [];
  }

  setWidth(width: number): PNGBuilder {
    this.png.width = width;
    return this;
  }
  setHeight(height: number): PNGBuilder {
    this.png.height = height;
    return this;
  }
  setBitDepth(bitDepth: number): PNGBuilder {
    this.png.bitDepth = bitDepth;
    return this;
  }
  setColor(color: number): PNGBuilder {
    this.png.color = color;
    return this;
  }
  setCompressionMethod(method: number): PNGBuilder {
    this.png.compressionMethod = method;
    return this;
  }
  setFilterMethod(method: number): PNGBuilder {
    this.png.filterMethod = method;
    return this;
  }
  setPaletteEntries(entries: Uint8Array[]): PNGBuilder {
    this.png.paletteEntries = entries;
    return this;
  }
  setPaletteEntriesTransparency(entries: Uint8Array): PNGBuilder {
    this.png.paletteEntriesTransparency = entries;
    return this;
  }
  setIsInterlaced(isInterlaced: number): PNGBuilder {
    this.png.isInterlaced = isInterlaced;
    return this;
  }
  pushImageData(data: Uint8Array): PNGBuilder {
    this.InflatedImageData.push(...data);
    return this;
  }
  inflateImageData(): PNGBuilder {
    this.png.ImageData = pako.inflate(this.InflatedImageData);
    return this;
  }
  setGamaIntensity(gamaIntensity: number): PNGBuilder {
    this.png.gamaIntensity = gamaIntensity;
    return this;
  }
  setChromaticities(data: number[][]) {
    this.png.chromaticities = data;
  }
  setICCProfile(iCCProfile: any[]) {
    this.png.ICCProfile = iCCProfile;
  }
  setRenderingIntent(renderingIntent: number) {
    this.png.renderingIntent = renderingIntent;
  }
  setSignificantBits(significantBits: number[]) {
    this.png.significantBits = significantBits;
  }
  setBackgroundColor(backgroundColor: Uint8Array[]) {
    this.png.backgroundColor = backgroundColor;
  }
  setPixelDimensions(pixelDimensions: Uint8Array[]) {
    this.png.pixelDimensions = pixelDimensions;
  }
  setSuggestedPalette(
    name: string,
    depth: number,
    entries: number[][],
    frequencies: number[][]
  ) {
    const suggestedPalette = new SuggestedPalette();

    suggestedPalette.name = name;
    suggestedPalette.depth = depth;
    suggestedPalette.entries = entries;
    suggestedPalette.frequencies = frequencies;

    this.png.suggestedPalette.push(suggestedPalette);
  }
  getPNG(): PNG {
    return this.png;
  }
}
