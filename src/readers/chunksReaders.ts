import Reader from "./baseReader";
import PNGBuilder from "../builder";
import crc32 from "crc/crc32";
import pako from "pako";

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
  protected removeFromReadersList(reader, readers: ChunckReader[]) {
    readers = readers.filter((r) => r instanceof reader);
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

// An sRGB chunk or iCCP chunk, when present and recognized, overrides the cHRM chunk.
export class cHRMChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 330;
  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const data: number[][] = [];
    for (let index = 0; index < 4; index++) {
      const xy = [
        this.binary.nextBytes(4).stack(),
        this.binary.nextBytes(4).stack(),
      ];
      data.push(xy);
    }

    builder.setChromaticities(data);
    this.leaveReadersList(readers);
  }
}

export class sRGBChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 334;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    builder.setRenderingIntent(this.binary.nextByte());

    this.leaveReadersList(readers);
    this.removeFromReadersList(iCCPChunkReader, readers);
  }
}

export class iCCPChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 319;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const data: any[] = [];

    let accumulator = "";
    let index = 0;
    while (index < 79) {
      if (this.binary.peek() === 0) break;

      const byte = this.binary.nextByte();

      if (!((byte >= 32 && byte <= 126) || byte >= 161 || byte <= 255)) return;

      accumulator += String.fromCharCode(byte);

      index++;
    }

    data.push(accumulator);

    this.binary.nextByte();

    const compressionMethod = this.binary.nextByte();
    data.push(compressionMethod);

    const compressedProfileLength = index + 2 - this.chunkLength;

    const compressedProfile = pako.inflate(
      this.binary.nextBytes(compressedProfileLength)
    );

    data.push(compressedProfile);

    builder.setICCProfile(data);
    this.leaveReadersList(readers);
    this.removeFromReadersList(sRGBChunkReader, readers);
  }
}

export class sBITChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 338;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    let significantBits;
    const colorType = builder.getPNG().color;

    switch (colorType) {
      case 0:
        significantBits = this.binary.nextBytes(1);
        break;
      case 2 || 3:
        significantBits = this.binary.nextBytes(3);
        break;
      case 4:
        significantBits = this.binary.nextBytes(2);
        break;
      case 6:
        significantBits = this.binary.nextBytes(4);
        break;
      default:
        return;
    }

    builder.setSignificantBits(significantBits);
    this.leaveReadersList(readers);
  }
}

export class bKGDChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 312;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    let backgroundColor: Uint8Array[] = [];
    const colorType = builder.getPNG().color;

    switch (colorType) {
      case 0:
        backgroundColor.push(this.binary.nextBytes(2));
        break;
      case 2 || 6:
        backgroundColor.push(
          this.binary.nextBytes(2),
          this.binary.nextBytes(2),
          this.binary.nextBytes(2)
        );
        break;
      case 3:
        backgroundColor.push(this.binary.nextBytes(1));
        break;
      default:
        return;
    }

    builder.setBackgroundColor(backgroundColor);
    this.leaveReadersList(readers);
  }
}

export class pHYsChunkReader extends ChunckReader {
  protected chunckData: Uint8Array;
  protected readonly headerNumber = 388;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const pixelDimensions: Uint8Array[] = [];

    pixelDimensions.push(
      this.binary.nextBytes(4),
      this.binary.nextBytes(4),
      this.binary.nextBytes(1)
    );

    builder.setPixelDimensions(pixelDimensions);
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
