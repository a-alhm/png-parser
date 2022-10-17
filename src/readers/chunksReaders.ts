import Reader from "./baseReader";
import IIteratableBinary from "../IIteratableBinary";
import PNGBuilder from "../builder";
import crc32 from "crc/crc32";

export abstract class ChunckReader extends Reader {
  protected abstract chunckData: Uint8Array;
  protected chunkLength: number;

  abstract read(
    binary: IIteratableBinary,
    builder: PNGBuilder,
    readers?: ChunckReader[]
  ): void;
  readAndSetChunkLength(binary: IIteratableBinary) {
    this.chunkLength = binary.nextBytes(4).stack();
  }
  readAndSetChunckData(binary: IIteratableBinary): void {
    this.chunckData = Uint8Array.from([
      ...binary.nextBytes(4),
      ...binary.peekBytes(this.chunkLength),
    ]);
  }
  isChunckDataCorrupted(binary: IIteratableBinary): boolean {
    let chunckCRC = binary.nextBytes(4).stack() >>> 0;
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

  read(binary: IIteratableBinary, builder: PNGBuilder): void {
    const width = binary.nextBytes(4).stack();
    const height = binary.nextBytes(4).stack();
    const bitDepth = binary.nextByte();
    const color = binary.nextByte();
    const compressionMethod = binary.nextByte();
    const filterMethod = binary.nextByte();
    const isInterlaced = binary.nextByte();

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
  protected chunkLength: number;
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 295;
  read(binary: IIteratableBinary, builder: PNGBuilder): void {
    const plteDataRaw = binary.nextBytes(this.chunkLength);
    const plteDataPlatted = plteDataRaw.packEvery(3);

    builder.setPaletteEntries(plteDataPlatted);
  }
  isChunckLengthDivisibleByThree(length: number) {
    if (length % 3 === 0) return true;
    return false;
  }
}

export class tRNSChunkReader extends ChunckReader {
  protected chunkLength: number;
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 359;
  read(
    binary: IIteratableBinary,
    builder: PNGBuilder,
    readers: ChunckReader[]
  ): void {
    const tRNSData = binary.nextBytes(this.chunkLength);

    builder.setPaletteEntriesTransparency(tRNSData);

    this.leaveReadersList(readers);
  }
}

export class gAMAChunkReader extends ChunckReader {
  protected chunkLength: number;
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 310;
  read(
    binary: IIteratableBinary,
    builder: PNGBuilder,
    readers: ChunckReader[]
  ): void {
    const gAMAData = binary.nextBytes(4).stack();

    builder.setGamaIntensity(gAMAData);
    this.leaveReadersList(readers);
  }
}

export class IDATChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 290;
  read(binary: IIteratableBinary, builder: PNGBuilder): void {
    const IDATData = binary.nextBytes(this.chunkLength);

    builder.pushImageData(IDATData);
  }
}

export class IENDChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 288;
  read(binary: IIteratableBinary, builder: PNGBuilder): void {
    builder.inflateImageData();
  }
}
