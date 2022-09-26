import Reader from "./baseReader";
import IIteratableBinary from "../IIteratableBinary";
import PNGBuilder from "../builder";
import crc32 from 'crc/crc32';

export abstract class ChunckReader extends Reader{
    protected abstract chunckData : Uint8Array
    abstract read(binary: IIteratableBinary, builder: PNGBuilder, chunkLength?: number): void;
    setChunckData(binary: IIteratableBinary, chunkLength: number): void{
        this.chunckData = Uint8Array.from(
            [...binary.nextBytes(4) 
              ,...binary.peekBytes(chunkLength)]);
    }
    isChunckDataCorrupted(binary: IIteratableBinary): boolean{
        let chunckCRC = binary.nextBytes(4).stack() >>> 0;
        const calculatedCRC = crc32(this.chunckData);

        if(chunckCRC === calculatedCRC) return false;
        return true;
    }
}

export class IHDRChunkReader extends ChunckReader{
    protected chunckData: Uint8Array;
    protected readonly headerNumber = 295;
    private chunckLength = 13;
    read(binary: IIteratableBinary, builder: PNGBuilder): void {
        const width = binary.nextBytes(4).stack();
        const height = binary.nextBytes(4).stack();
        const bitDepth = binary.nextByte();
        const color = binary.nextByte();
        const compressionMethod = binary.nextByte();
        const filterMethod = binary.nextByte();
        const isInterlaced = binary.nextByte();

        builder.setWidth(width)
        .setHeight(height)
        .setBitDepth(bitDepth)
        .setColor(color)
        .setCompressionMethod(compressionMethod)
        .setFilterMethod(filterMethod)
        .setIsInterlaced(isInterlaced)
    }
    isChunckLengthMatch(length: number){
        if(this.chunckLength === length) return true
        return false
    }
}

export class PLTEChunkReader extends ChunckReader{
    protected chunckData: Uint8Array;
    protected readonly headerNumber = 295;
    read(binary: IIteratableBinary, builder: PNGBuilder, chunkLength: number): void {
        const plteDataRaw = binary.nextBytes(chunkLength)
        const plteDataPlatted = plteDataRaw.packEvery(3);

        builder.setPaletteEntries(plteDataPlatted)
    }
    isChunckLengthDivisibleByThree(length: number){
        if(length % 3 === 0) return true;
        return false;
    }
}

export class tRNSChunkReader extends ChunckReader{
    protected chunckData: Uint8Array;
    protected readonly headerNumber = 359;
    read(binary: IIteratableBinary, builder: PNGBuilder, chunkLength: number): void {
        const tRNSData = binary.nextBytes(chunkLength)

        builder.setPaletteEntriesTransparency(tRNSData)
    }
}

export class gAMAChunkReader extends ChunckReader{
    protected chunckData: Uint8Array;
    protected readonly headerNumber = 310;
    read(binary: IIteratableBinary, builder: PNGBuilder): void {
        const gAMAData = binary.nextBytes(4).stack();

        builder.setGamaIntensity(gAMAData)
    }
}

export class IDATChunkReader extends ChunckReader{
    protected chunckData: Uint8Array;
    protected readonly headerNumber = 290;
    read(binary: IIteratableBinary, builder: PNGBuilder, chunkLength: number): void {
        const IDATData = binary.nextBytes(chunkLength)

        builder.pushImageData(IDATData)
    }
}


export class IENDChunkReader extends ChunckReader{
    protected chunckData: Uint8Array;
    protected readonly headerNumber = 288;
    read(binary: IIteratableBinary, builder: PNGBuilder): void {
        builder.inflateImageData();
    }
}
