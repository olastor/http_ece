import { base64, base64url, bytes } from "./deps.js";
import { DEFAULT_RECORD_SIZE, HEADER_LENGTH_MIN, IDLEN_LENGTH, RECORD_SIZE_MAX, RECORD_SIZE_MIN, RS_LENGTH, SALT_LENGTH, } from "./const.js";
import { Salt } from "./salt.js";
export class Header {
    get idlen() {
        return this.keyid.byteLength;
    }
    get byteLength() {
        return HEADER_LENGTH_MIN + this.idlen;
    }
    constructor({ salt = new Salt(), rs = DEFAULT_RECORD_SIZE, keyid = new Uint8Array(), }) {
        Object.defineProperty(this, "salt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "keyid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (rs < RECORD_SIZE_MIN || rs > RECORD_SIZE_MAX) {
            throw new RecordSizeError(rs);
        }
        this.salt = salt instanceof Salt ? salt : new Salt(salt);
        this.rs = rs;
        this.keyid = keyid;
    }
    static fromBytes(buf) {
        if (buf.byteLength < HEADER_LENGTH_MIN) {
            throw new HeaderSizeError(buf);
        }
        const dv = new DataView(buf);
        let cur = 0;
        const salt = dv.buffer.slice(0, SALT_LENGTH);
        cur += SALT_LENGTH;
        const rs = dv.getUint32(cur);
        cur += RS_LENGTH;
        const idlen = dv.getUint8(cur);
        cur += IDLEN_LENGTH;
        const keyid = dv.buffer.slice(cur, cur + idlen);
        cur += idlen;
        return new Header({
            salt: new Salt(salt),
            rs,
            keyid: new Uint8Array(keyid),
        });
    }
    static fromBase64(b) {
        return Header.fromBytes(base64.decode(b).buffer);
    }
    static fromBase64Url(b) {
        return Header.fromBytes(base64url.decode(b).buffer);
    }
    toBytes() {
        const bytes = new Uint8Array(this.byteLength);
        const dv = new DataView(bytes.buffer);
        bytes.set(this.salt);
        dv.setUint32(SALT_LENGTH, this.rs);
        dv.setUint8(SALT_LENGTH + RS_LENGTH, this.idlen);
        bytes.set(this.keyid, SALT_LENGTH + RS_LENGTH + IDLEN_LENGTH);
        return bytes.buffer;
    }
    toBase64() {
        return base64.encode(this.toBytes());
    }
    toBase64Url() {
        return base64url.encode(this.toBytes());
    }
    equals(other) {
        return bytes.equalsNaive(this.salt, other.salt) &&
            this.rs === other.rs &&
            bytes.equalsNaive(this.keyid, other.keyid);
    }
}
export class RecordSizeError extends Error {
    constructor(rs) {
        super(`record size must be comprised between ${RECORD_SIZE_MIN} and ${RECORD_SIZE_MAX}: got ${rs}`);
    }
}
export class HeaderSizeError extends Error {
    constructor(bytes) {
        super(`header block must be at least ${HEADER_LENGTH_MIN} byte long: got ${bytes.byteLength}`);
    }
}
