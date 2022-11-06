import { PNG, SuggestedPalette, ICCProfile, Time } from "./png";
import { injectable } from "inversify";

@injectable()
export default class PNGBuilder {
  private png: PNG;
  private inflatedImageData: number[];

  get InflatedImageData() {
    return this.inflatedImageData;
  }

  constructor() {
    this.png = new PNG();
    this.inflatedImageData = [];
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
  setPaletteEntriesTransparency(
    entries: Uint8Array[] | Uint8Array
  ): PNGBuilder {
    this.png.paletteEntriesTransparency = entries;
    return this;
  }
  setIsInterlaced(isInterlaced: number): PNGBuilder {
    this.png.isInterlaced = isInterlaced;
    return this;
  }
  pushImageData(data: Uint8Array): PNGBuilder {
    this.inflatedImageData.push(...data);
    return this;
  }
  setImageData(data: Uint8Array): PNGBuilder {
    this.png.imageData = data;
    return this;
  }
  setGamaIntensity(gamaIntensity: number): PNGBuilder {
    this.png.gamaIntensity = gamaIntensity;
    return this;
  }
  setChromaticities(data: number[][]) {
    this.png.chromaticities = data;
  }
  setICCProfile(
    name: string,
    compressionMethod: number,
    compressedProfile: Uint8Array
  ) {
    const iCCProfile = new ICCProfile();

    iCCProfile.name = name;
    iCCProfile.compressionMethod = compressionMethod;
    iCCProfile.compressedProfile = compressedProfile;

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
  setImageHistogram(imageHistogram: Uint8Array[]) {
    this.png.imageHistogram = imageHistogram;
  }
  setLastModificationTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number
  ) {
    const lastModificationTime = new Time();

    lastModificationTime.year = year;
    lastModificationTime.year = month;
    lastModificationTime.year = day;
    lastModificationTime.year = hour;
    lastModificationTime.year = minute;
    lastModificationTime.year = second;

    this.png.lastModificationTime = lastModificationTime;
  }
  setTextualData(textualData: string[]) {
    this.png.textualData.push(textualData);
  }
  setCompressedTextualData(compressedTextualData: string[]) {
    this.png.compressedTextualData.push(compressedTextualData);
  }
  setInternationalTextualData(internationalTextualData: string[]) {
    this.png.internationalTextualData.push(internationalTextualData);
  }
  getPNG(): PNG {
    return this.png;
  }
}
