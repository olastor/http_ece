"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderSizeError = exports.RecordSizeError = exports.Header = void 0;
const deps_js_1 = require("./deps.js");
const const_js_1 = require("./const.js");
const salt_js_1 = require("./salt.js");
class Header {
    get idlen() {
        return this.keyid.byteLength;
    }
    get byteLength() {
        return const_js_1.HEADER_LENGTH_MIN + this.idlen;
    }
    constructor({ salt = new salt_js_1.Salt(), rs = const_js_1.DEFAULT_RECORD_SIZE, keyid = new Uint8Array(), }) {
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
        if (rs < const_js_1.RECORD_SIZE_MIN || rs > const_js_1.RECORD_SIZE_MAX) {
            throw new RecordSizeError(rs);
        }
        this.salt = salt instanceof salt_js_1.Salt ? salt : new salt_js_1.Salt(salt);
        this.rs = rs;
        this.keyid = keyid;
    }
    static fromBytes(buf) {
        if (buf.byteLength < const_js_1.HEADER_LENGTH_MIN) {
            throw new HeaderSizeError(buf);
        }
        const dv = new DataView(buf);
        let cur = 0;
        const salt = dv.buffer.slice(0, const_js_1.SALT_LENGTH);
        cur += const_js_1.SALT_LENGTH;
        const rs = dv.getUint32(cur);
        cur += const_js_1.RS_LENGTH;
        const idlen = dv.getUint8(cur);
        cur += const_js_1.IDLEN_LENGTH;
        const keyid = dv.buffer.slice(cur, cur + idlen);
        cur += idlen;
        return new Header({
            salt: new salt_js_1.Salt(salt),
            rs,
            keyid: new Uint8Array(keyid),
        });
    }
    static fromBase64(b) {
        return Header.fromBytes(deps_js_1.base64.decode(b).buffer);
    }
    static fromBase64Url(b) {
        return Header.fromBytes(deps_js_1.base64url.decode(b).buffer);
    }
    toBytes() {
        const bytes = new Uint8Array(this.byteLength);
        const dv = new DataView(bytes.buffer);
        bytes.set(this.salt);
        dv.setUint32(const_js_1.SALT_LENGTH, this.rs);
        dv.setUint8(const_js_1.SALT_LENGTH + const_js_1.RS_LENGTH, this.idlen);
        bytes.set(this.keyid, const_js_1.SALT_LENGTH + const_js_1.RS_LENGTH + const_js_1.IDLEN_LENGTH);
        return bytes.buffer;
    }
    toBase64() {
        return deps_js_1.base64.encode(this.toBytes());
    }
    toBase64Url() {
        return deps_js_1.base64url.encode(this.toBytes());
    }
    equals(other) {
        return deps_js_1.bytes.equalsNaive(this.salt, other.salt) &&
            this.rs === other.rs &&
            deps_js_1.bytes.equalsNaive(this.keyid, other.keyid);
    }
}
exports.Header = Header;
class RecordSizeError extends Error {
    constructor(rs) {
        super(`record size must be comprised between ${const_js_1.RECORD_SIZE_MIN} and ${const_js_1.RECORD_SIZE_MAX}: got ${rs}`);
    }
}
exports.RecordSizeError = RecordSizeError;
class HeaderSizeError extends Error {
    constructor(bytes) {
        super(`header block must be at least ${const_js_1.HEADER_LENGTH_MIN} byte long: got ${bytes.byteLength}`);
    }
}
exports.HeaderSizeError = HeaderSizeError;
