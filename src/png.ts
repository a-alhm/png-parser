export class PNG {
  constructor() {
    this.suggestedPalette = [];
    this.textualData = [];
    this.compressedTextualData = [];
    this.internationalTextualData = [];
  }

  imageData;
  plte: Uint8Array;
  tRNS: Uint8Array;
  isInterlaced: number;
  bitDepth: number;
  color: number;
  width: number;
  height: number;
  compressionMethod: number;
  filterMethod: number;
  paletteEntries: Uint8Array[];
  paletteEntriesTransparency: Uint8Array[] | Uint8Array;
  gamaIntensity: number;
  chromaticities: number[][];
  ICCProfile: ICCProfile;
  renderingIntent: number;
  significantBits: number[];
  backgroundColor: Uint8Array[];
  pixelDimensions: Uint8Array[];
  suggestedPalette: SuggestedPalette[];
  imageHistogram: Uint8Array[];
  lastModificationTime: Time;
  textualData: string[][];
  compressedTextualData: string[][];
  internationalTextualData: string[][];
}
export class ICCProfile {
  name: string;
  compressionMethod: number;
  compressedProfile: Uint8Array;
}
export class SuggestedPalette {
  name: string;
  depth: number;
  entries: number[][];
  frequencies: number[][];
}
export class Time {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
