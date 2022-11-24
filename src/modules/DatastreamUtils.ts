import crc32 from "crc/crc32";
import pako from "pako";

export default class DatastreamUtils {
  static crc(data: Uint8Array) {
    return crc32(data);
  }
  static inflate(data: Uint8Array): Uint8Array {
    return pako.inflate(data);
  }
}
