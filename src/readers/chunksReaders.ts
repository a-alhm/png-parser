import Reader from "./baseReader";
import PNGBuilder from "../builder";
import crc32 from "crc/crc32";

export abstract class ChunckReader extends Reader {
  protected abstract chunckData: Uint8Array;
  protected chunkLength: number;

  abstract read(builder: PNGBuilder, readers?: ChunckReader[]): void;

  readAndSetChunkLength() {
    this.chunkLength = this.binary.nextBytes(4).stack();
  }
  readAndSetChunckData(): void {
    this.chunckData = Uint8Array.from([
      ...this.binary.nextBytes(4),
      ...this.binary.peekBytes(this.chunkLength),
    ]);
  }
  isChunckDataCorrupted(): boolean {
    let chunckCRC = this.binary.nextBytes(4).stack() >>> 0;
    const calculatedCRC = crc32(this.chunckData);

    if (chunckCRC === calculatedCRC) return false;
    return true;
  }
  protected leaveReadersList(readers: ChunckReader[]) {
    readers = readers.filter((r) => r === this);
  }
}

export class IHDRChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 295;
  private IHDRChunckLength = 13;

  read(builder: PNGBuilder): void {
    const width = this.binary.nextBytes(4).stack();
    const height = this.binary.nextBytes(4).stack();
    const bitDepth = this.binary.nextByte();
    const color = this.binary.nextByte();
    const compressionMethod = this.binary.nextByte();
    const filterMethod = this.binary.nextByte();
    const isInterlaced = this.binary.nextByte();

    builder
      .setWidth(width)
      .setHeight(height)
      .setBitDepth(bitDepth)
      .setColor(color)
      .setCompressionMethod(compressionMethod)
      .setFilterMethod(filterMethod)
      .setIsInterlaced(isInterlaced);
  }
  chunckLengthMatch() {
    if (this.IHDRChunckLength === this.chunkLength) return true;
    return false;
  }
}

export class PLTEChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 295;
  read(builder: PNGBuilder): void {
    const plteDataRaw = this.binary.nextBytes(this.chunkLength);
    const plteDataPlatted = plteDataRaw.packEvery(3);

    builder.setPaletteEntries(plteDataPlatted);
  }
  chunckLengthDivisibleByThree() {
    if (this.chunkLength % 3 === 0) return true;
    return false;
  }
}

export class tRNSChunkReader extends ChunckReader {
  protected chunkLength: number;
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 359;
  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const tRNSData = this.binary.nextBytes(this.chunkLength);

    builder.setPaletteEntriesTransparency(tRNSData);

    this.leaveReadersList(readers);
  }
}

export class gAMAChunkReader extends ChunckReader {
  protected chunkLength: number;
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 310;
  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const gAMAData = this.binary.nextBytes(4).stack();

    builder.setGamaIntensity(gAMAData);
    this.leaveReadersList(readers);
  }
}

export class IDATChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 290;
  read(builder: PNGBuilder): void {
    const IDATData = this.binary.nextBytes(this.chunkLength);

    builder.pushImageData(IDATData);
  }
}

export class IENDChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 288;
  read(builder: PNGBuilder): void {
    builder.inflateImageData();
  }
}
