import { Salt } from "./salt.js";
export interface HeaderOptions {
    salt?: Salt | Uint8Array | ArrayBuffer;
    rs?: number;
    keyid?: Uint8Array;
}
export declare class Header {
    readonly salt: Salt;
    readonly rs: number;
    readonly keyid: Uint8Array;
    get idlen(): number;
    get byteLength(): number;
    constructor({ salt, rs, keyid, }: HeaderOptions);
    static fromBytes(buf: ArrayBuffer): Header;
    static fromBase64(b: string): Header;
    static fromBase64Url(b: string): Header;
    toBytes(): ArrayBuffer;
    toBase64(): string;
    toBase64Url(): string;
    equals(other: Header): boolean;
}
export declare class RecordSizeError extends Error {
    constructor(rs: number);
}
export declare class HeaderSizeError extends Error {
    constructor(bytes: ArrayBuffer);
}
