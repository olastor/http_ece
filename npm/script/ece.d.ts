import { Header } from "./header.js";
import { ECECryptoOptions } from "./ece_crypto.js";
/**
 * @param data is the buffer to encrypt or a RecordIterable.
 * @param secret is the encryption secret
 * @param options
 * @returns encrypted data
 */
export declare function encrypt(data: RecordIterable | ArrayBuffer, secret: ArrayBuffer, options?: ECECryptoOptions): Promise<ArrayBuffer>;
/**
 * PlainTextRecord define a single unencrypted record.
 */
export declare class PlainTextRecord extends ArrayBuffer {
}
/**
 * RecordIterable splits input data into records ready
 * to be encrypted.
 * This interface exists mainly to support different padding
 * strategy.
 */
export interface RecordIterable {
    [Symbol.iterator](): Iterator<PlainTextRecord, PlainTextRecord>;
    readonly length: number;
}
export declare abstract class RecordIterable implements RecordIterable {
}
/**
 * WithPaddingRecordIterable is a fixed padding RecordIterable.
 */
export declare class WithPaddingRecordIterable extends RecordIterable {
    readonly length: number;
    private readonly data;
    private readonly rs;
    private readonly ds;
    private readonly extraPadding;
    constructor(data: ArrayBuffer, rs: number, extraPadding?: number);
    [Symbol.iterator](): Iterator<PlainTextRecord, PlainTextRecord, undefined>;
}
export declare class InvalidDataSizeError extends Error {
    constructor(maxDataSize: number, data: ArrayBuffer);
}
export type PadDelimiter = 0x01 | 0x02;
/** Add padding to an ArrayBuffer
 * @param data the buffer without padding
 * @param padLen length of padding without delimiter
 * @param padDelimiter the padding delimiter
 * @returns an ArrayBuffer with padding.
 */
export declare function pad(data: ArrayBuffer, padLen: number, padDelimiter: PadDelimiter): ArrayBuffer;
export declare function unpad(record: ArrayBuffer): ArrayBuffer;
/**
 * @param data is the encrypted data with the header block
 * @param secret is the secret used to encrypt the data
 * @param header an optional header if not part of data.
 * @returns the decrypted data
 */
export declare function decrypt(data: ArrayBuffer, secret: ArrayBuffer, header?: Header): Promise<ArrayBuffer>;
