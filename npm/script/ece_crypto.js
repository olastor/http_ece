"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceedRecordSequenceNumberError = exports.ECECrypto = void 0;
const dntShim = __importStar(require("./_dnt.shims.js"));
const header_js_1 = require("./header.js");
const const_js_1 = require("./const.js");
/**
 * ECECrypto define an helper class that handle the
 * encryption and decryption of records one by one.
 * This class is stateless and is used as a building
 * block for ECE & ECEStream classes.
 */
class ECECrypto {
    constructor(ikm, { header = new header_js_1.Header({}), info = const_js_1.CEK_INFO, subtleCrypto = dntShim.crypto.subtle, }) {
        Object.defineProperty(this, "info", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "header", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "crypto", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Input Keying Material
        Object.defineProperty(this, "ikm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Pseudo Random Key
        Object.defineProperty(this, "prk", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Content Encryption Key
        Object.defineProperty(this, "cek", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Number once
        Object.defineProperty(this, "nonce", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.ikm = ikm;
        this.info = info;
        this.header = header instanceof header_js_1.Header ? header : new header_js_1.Header(header);
        this.crypto = subtleCrypto;
    }
    async getPRK() {
        if (this.prk === null) {
            this.prk = await this.hmacSha256(this.header.salt.buffer, this.ikm);
        }
        return this.prk;
    }
    async getCEK() {
        let rawCEK = null;
        if (this.cek === null) {
            rawCEK = await this.hmacSha256(await this.getPRK(), this.info, const_js_1.KEY_LENGTH);
            this.cek = await this.crypto.importKey("raw", rawCEK, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
        }
        return this.cek;
    }
    async getNonce() {
        if (this.nonce === null) {
            this.nonce = await this.hmacSha256(await this.getPRK(), const_js_1.NONCE_INFO, const_js_1.NONCE_LENGTH);
        }
        return this.nonce;
    }
    async deriveNonce(seq) {
        if (seq > 0xffffffff) {
            throw new ExceedRecordSequenceNumberError(seq);
        }
        const nonce = new DataView((await this.getNonce()).slice(0));
        const m = nonce.getUint32(nonce.byteLength - 4);
        // forces unsigned int xor
        const xor = (m ^ seq) >>> 0;
        nonce.setUint32(nonce.byteLength - 4, xor);
        return new Uint8Array(nonce.buffer);
    }
    async hmacSha256(secret, body, length) {
        if (secret instanceof ArrayBuffer) {
            secret = await this.crypto.importKey("raw", secret, {
                name: "HMAC",
                hash: "SHA-256",
            }, false, ["sign"]);
        }
        const result = await this.crypto.sign("HMAC", secret, body);
        if (length !== null)
            return result.slice(0, length);
        return result;
    }
    /** Encrypt a single record.
     * @param data is padded data of size rs to encrypt
     * @param seq is the record sequence number
     * @returns encrypted data
     */
    async encryptRecord(data, seq) {
        return this._encryptRecord(data, seq, await this.getCEK());
    }
    async _encryptRecord(data, seq, cek) {
        const crypted = await this.crypto.encrypt({
            name: "AES-GCM",
            iv: await this.deriveNonce(seq),
            tagLength: 128,
        }, cek, data);
        return crypted;
    }
    /** Decrypt a single record.
     * @param crypted is the crypted record
     * @param seq is the record sequence number
     * @returns decrypted record
     */
    async decryptRecord(crypted, seq) {
        return this._decryptRecord(crypted, seq, await this.getCEK());
    }
    async _decryptRecord(crypted, seq, cek) {
        const data = await this.crypto.decrypt({
            name: "AES-GCM",
            iv: await this.deriveNonce(seq),
            tagLength: 128,
        }, cek, crypted);
        return data;
    }
}
exports.ECECrypto = ECECrypto;
class ExceedRecordSequenceNumberError extends Error {
    constructor(seq) {
        super(`record sequence number exceed limit (${0xffffffff}): got ${seq}`);
    }
}
exports.ExceedRecordSequenceNumberError = ExceedRecordSequenceNumberError;
