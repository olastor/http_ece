import * as dntShim from "./_dnt.shims.js";
import { Header, HeaderOptions } from "./header.js";
export interface ECECryptoOptions {
    header?: Header | HeaderOptions;
    info?: Uint8Array;
    subtleCrypto?: dntShim.SubtleCrypto;
}
/**
 * ECECrypto define an helper class that handle the
 * encryption and decryption of records one by one.
 * This class is stateless and is used as a building
 * block for ECE & ECEStream classes.
 */
export declare class ECECrypto {
    readonly info: Uint8Array;
    readonly header: Header;
    readonly crypto: dntShim.SubtleCrypto;
    private readonly ikm;
    private prk;
    private cek;
    private nonce;
    constructor(ikm: ArrayBuffer, { header, info, subtleCrypto, }: ECECryptoOptions);
    protected getPRK(): Promise<ArrayBuffer>;
    protected getCEK(): Promise<dntShim.CryptoKey>;
    protected getNonce(): Promise<ArrayBuffer>;
    protected deriveNonce(seq: number): Promise<Uint8Array>;
    protected hmacSha256(secret: dntShim.CryptoKey | ArrayBuffer, body: ArrayBuffer, length?: number): Promise<ArrayBuffer>;
    /** Encrypt a single record.
     * @param data is padded data of size rs to encrypt
     * @param seq is the record sequence number
     * @returns encrypted data
     */
    encryptRecord(data: ArrayBuffer, seq: number): Promise<ArrayBuffer>;
    private _encryptRecord;
    /** Decrypt a single record.
     * @param crypted is the crypted record
     * @param seq is the record sequence number
     * @returns decrypted record
     */
    decryptRecord(crypted: ArrayBuffer, seq: number): Promise<ArrayBuffer>;
    private _decryptRecord;
}
export declare class ExceedRecordSequenceNumberError extends Error {
    constructor(seq: number);
}
