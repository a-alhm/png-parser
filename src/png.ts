export class PNG {
  constructor() {
    this.suggestedPalette = [];
  }
  ImageData;
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
  ICCProfile: any[];
  renderingIntent: number;
  significantBits: number[];
  backgroundColor: Uint8Array[];
  pixelDimensions: Uint8Array[];
  suggestedPalette: SuggestedPalette[];
}

export class SuggestedPalette {
  name: string;
  depth: number;
  entries: number[][];
  frequencies: number[][];
}
