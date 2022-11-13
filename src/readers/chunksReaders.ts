import Reader from "./baseReader";
import PNGBuilder from "../builder";
import DatastreamUtils from "../modules/DatastreamUtils";
export abstract class ChunckReader extends Reader {
  protected chunckData: Uint8Array;
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
    const calculatedCRC = DatastreamUtils.crc(this.chunckData);

    if (chunckCRC === calculatedCRC) return false;
    return true;
  }
  protected leaveReadersList(readers: ChunckReader[]) {
    readers = readers.filter((r) => r === this);
  }
  protected removeFromReadersList(reader, readers: ChunckReader[]) {
    readers = readers.filter((r) => r instanceof reader);
  }
  protected readKeywordText(): string {
    let accumulator = "";
    let index = 0;
    while (index < 79) {
      if (this.binary.peek() === 0) break;

      const byte = this.binary.nextByte();

      if (!((byte >= 32 && byte <= 126) || byte >= 161 || byte <= 255)) return;

      accumulator += String.fromCharCode(byte);

      index++;
    }

    return accumulator;
  }
}

export class IHDRChunkReader extends ChunckReader {
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
  protected readonly headerNumber = 309;
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
  protected readonly headerNumber = 359;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    let tRNSData: Uint8Array[] | Uint8Array = [];

    const colorType = builder.getPNG().color;

    switch (colorType) {
      case 0:
        tRNSData.push(this.binary.nextBytes(2));
        break;
      case 2:
        tRNSData.push(
          this.binary.nextBytes(2),
          this.binary.nextBytes(2),
          this.binary.nextBytes(2)
        );
        break;
      case 3:
        tRNSData = this.binary.nextBytes(this.chunkLength);
        break;
      default:
        return;
    }

    builder.setPaletteEntriesTransparency(tRNSData);

    this.leaveReadersList(readers);
  }
}

export class gAMAChunkReader extends ChunckReader {
  protected chunkLength: number;
  protected readonly headerNumber = 310;
  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const gAMAData = this.binary.nextBytes(4).stack();

    builder.setGamaIntensity(gAMAData);
    this.leaveReadersList(readers);
  }
}

export class cHRMChunkReader extends ChunckReader {
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
  protected readonly headerNumber = 334;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    builder.setRenderingIntent(this.binary.nextByte());

    this.leaveReadersList(readers);
    this.removeFromReadersList(iCCPChunkReader, readers);
  }
}

export class iCCPChunkReader extends ChunckReader {
  protected readonly headerNumber = 319;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const name = this.readKeywordText();

    if (!name) return;

    this.binary.nextByte();

    const compressionMethod = this.binary.nextByte();

    const compressedProfileLength = this.chunkLength - (name.length + 1);

    const compressedProfile = DatastreamUtils.inflate(
      this.binary.nextBytes(compressedProfileLength)
    );

    builder.setICCProfile(name, compressionMethod, compressedProfile);
    this.leaveReadersList(readers);
    this.removeFromReadersList(sRGBChunkReader, readers);
  }
}

export class sBITChunkReader extends ChunckReader {
  protected readonly headerNumber = 338;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    let significantBits;
    const colorType = builder.getPNG().color;

    switch (colorType) {
      case 0:
        significantBits = this.binary.nextBytes(1);
        break;
      case 2:
      case 3:
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

export class sPLTChunkReader extends ChunckReader {
  protected readonly headerNumber = 355;

  read(builder: PNGBuilder): void {
    const name = this.readKeywordText();

    if (!name) return;

    this.binary.nextByte();

    const sampleDepth = this.binary.nextByte();

    if (!(sampleDepth === 8 || sampleDepth === 16)) return;

    let remainingLength = this.chunkLength - (name.length + 2);

    const allowedSampleDepths = {
      8: () => this.extractEntries(remainingLength, 6, 1),
      16: () => this.extractEntries(remainingLength, 10, 2),
    };

    const entries = allowedSampleDepths[sampleDepth]();

    if (!entries) return;

    remainingLength -= sampleDepth / 2;

    const paletteEntriesLength = builder.getPNG().paletteEntries.length;

    const frequencies = [];
    for (let index = 0; index < paletteEntriesLength; index++) {
      frequencies.push(this.binary.nextBytes(2));
    }

    builder.setSuggestedPalette(name, sampleDepth, entries, frequencies);
  }

  private extractEntries(
    remainingLength: number,
    divisible: number,
    rgbaByetsLength
  ) {
    let entries;

    if (remainingLength % divisible !== 0) return;

    entries = [
      this.binary.nextBytes(rgbaByetsLength),
      this.binary.nextBytes(rgbaByetsLength),
      this.binary.nextBytes(rgbaByetsLength),
      this.binary.nextBytes(rgbaByetsLength),
    ];

    return entries;
  }
}

export class hISTChunkReader extends ChunckReader {
  protected readonly headerNumber = 344;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    const paletteEntriesLength = builder.getPNG().paletteEntries.length;

    const frequencies = [];
    for (let index = 0; index < paletteEntriesLength; index++) {
      frequencies.push(this.binary.nextBytes(2));
    }

    builder.setImageHistogram(frequencies);
    this.leaveReadersList(readers);
  }
}

export class tIMEChunkReader extends ChunckReader {
  protected readonly headerNumber = 335;

  read(builder: PNGBuilder, readers: ChunckReader[]): void {
    builder.setLastModificationTime(
      this.binary.nextBytes(2).stack(),
      this.binary.nextByte(),
      this.binary.nextByte(),
      this.binary.nextByte(),
      this.binary.nextByte(),
      this.binary.nextByte()
    );

    this.leaveReadersList(readers);
  }
}

export class tEXtChunkReader extends ChunckReader {
  protected readonly headerNumber = 389;

  read(builder: PNGBuilder): void {
    const textualData = [];

    const keyword = this.readKeywordText();

    if (!keyword) return;

    this.binary.nextByte();

    textualData.push(keyword);

    const remainingLength = this.chunkLength - keyword.length - 1;

    const textString = this.binary.nextBytes(remainingLength).stringify();

    textualData.push(textString);

    builder.setTextualData(textualData);
  }
}

export class zTXtChunkReader extends ChunckReader {
  protected readonly headerNumber = 410;

  read(builder: PNGBuilder): void {
    const compressedTextualData = [];

    const keyword = this.readKeywordText();

    if (!keyword) return;

    this.binary.nextByte();

    compressedTextualData.push(keyword);

    const compressionMethod = this.binary.nextByte();

    compressedTextualData.push(compressionMethod);

    const remainingLength = this.chunkLength - keyword.length - 2;

    const compressedTextDatastream = DatastreamUtils.inflate(
      this.binary.nextBytes(remainingLength)
    ).stringify();

    compressedTextualData.push(compressedTextDatastream);

    builder.setCompressedTextualData(compressedTextualData);
  }
}

export class iTXtChunkReader extends ChunckReader {
  protected readonly headerNumber = 393;

  read(builder: PNGBuilder): void {
    const internationalTextualData = [];

    const keyword = this.readKeywordText();

    if (!keyword) return;

    this.binary.nextByte();

    internationalTextualData.push(keyword);

    const compressionFlag = this.binary.nextByte();

    internationalTextualData.push(compressionFlag);

    const compressionMethod = this.binary.nextByte();

    internationalTextualData.push(compressionMethod);

    const languageTag = this.readNullSeparatedText();

    internationalTextualData.push(languageTag);

    this.binary.nextByte();

    const translatedKeyword = this.readNullSeparatedText();

    internationalTextualData.push(translatedKeyword);

    this.binary.nextByte();

    const remainingLength =
      this.chunkLength -
      (keyword.length + languageTag.length + translatedKeyword.length + 5);

    let text = this.binary.nextBytes(remainingLength);

    if (compressionFlag) text = DatastreamUtils.inflate(text);

    internationalTextualData.push(text.stringify());

    builder.setInternationalTextualData(internationalTextualData);
  }

  protected readNullSeparatedText(): string {
    let accumulator = "";

    while (this.binary.peek() === 0) {
      const byte = this.binary.nextByte();

      accumulator += String.fromCharCode(byte);
    }

    return accumulator;
  }
}

export class IDATChunkReader extends ChunckReader {
  protected readonly headerNumber = 290;
  read(builder: PNGBuilder): void {
    const IDATData = this.binary.nextBytes(this.chunkLength);

    builder.pushImageData(IDATData);
  }
}

export class IENDChunkReader extends ChunckReader {
  protected readonly headerNumber = 288;
  read(builder: PNGBuilder): void {
    const imageData = DatastreamUtils.inflate(builder.InflatedImageData);

    builder.setImageData(imageData);
  }
}
