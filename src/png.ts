export default class PNG {
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
  paletteEntriesTransparency: Uint8Array;
  gamaIntensity: number;
}
