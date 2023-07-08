"use strict";
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
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
exports.crypto = exports.KeyStack = void 0;
/**
 * Extensions to the
 * [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
 * supporting additional encryption APIs.
 *
 * Provides additional digest algorithms that are not part of the WebCrypto
 * standard as well as a `subtle.digest` and `subtle.digestSync` methods. It
 * also provide a `subtle.timingSafeEqual()` method to compare array buffers
 * or data views in a way that isn't prone to timing based attacks.
 *
 * The "polyfill" delegates to `WebCrypto` where possible.
 *
 * The {@linkcode KeyStack} export implements the {@linkcode KeyRing} interface
 * for managing rotatable keys for signing data to prevent tampering, like with
 * HTTP cookies.
 *
 * @module
 */
const dntShim = __importStar(require("../../../../_dnt.shims.js"));
const mod_js_1 = require("./_wasm_crypto/mod.js");
const timing_safe_equal_js_1 = require("./timing_safe_equal.js");
const index_js_1 = require("./_fnv/index.js");
var keystack_js_1 = require("./keystack.js");
Object.defineProperty(exports, "KeyStack", { enumerable: true, get: function () { return keystack_js_1.KeyStack; } });
/**
 * A copy of the global WebCrypto interface, with methods bound so they're
 * safe to re-export.
 */
const webCrypto = ((crypto) => ({
    getRandomValues: crypto.getRandomValues?.bind(crypto),
    randomUUID: crypto.randomUUID?.bind(crypto),
    subtle: {
        decrypt: crypto.subtle?.decrypt?.bind(crypto.subtle),
        deriveBits: crypto.subtle?.deriveBits?.bind(crypto.subtle),
        deriveKey: crypto.subtle?.deriveKey?.bind(crypto.subtle),
        digest: crypto.subtle?.digest?.bind(crypto.subtle),
        encrypt: crypto.subtle?.encrypt?.bind(crypto.subtle),
        exportKey: crypto.subtle?.exportKey?.bind(crypto.subtle),
        generateKey: crypto.subtle?.generateKey?.bind(crypto.subtle),
        importKey: crypto.subtle?.importKey?.bind(crypto.subtle),
        sign: crypto.subtle?.sign?.bind(crypto.subtle),
        unwrapKey: crypto.subtle?.unwrapKey?.bind(crypto.subtle),
        verify: crypto.subtle?.verify?.bind(crypto.subtle),
        wrapKey: crypto.subtle?.wrapKey?.bind(crypto.subtle),
    },
}))(dntShim.dntGlobalThis.crypto);
const bufferSourceBytes = (data) => {
    let bytes;
    if (data instanceof Uint8Array) {
        bytes = data;
    }
    else if (ArrayBuffer.isView(data)) {
        bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
    else if (data instanceof ArrayBuffer) {
        bytes = new Uint8Array(data);
    }
    return bytes;
};
/**
 * An wrapper for WebCrypto adding support for additional non-standard
 * algorithms, but delegating to the runtime WebCrypto implementation whenever
 * possible.
 */
const stdCrypto = ((x) => x)({
    ...webCrypto,
    subtle: {
        ...webCrypto.subtle,
        async digest(algorithm, data) {
            const { name, length } = normalizeAlgorithm(algorithm);
            const bytes = bufferSourceBytes(data);
            if (FNVAlgorithms.includes(name)) {
                return (0, index_js_1.fnv)(name, bytes);
            }
            // We delegate to WebCrypto whenever possible,
            if (
            // if the algorithm is supported by the WebCrypto standard,
            webCryptoDigestAlgorithms.includes(name) &&
                // and the data is a single buffer,
                bytes) {
                return webCrypto.subtle.digest(algorithm, bytes);
            }
            else if (mod_js_1.digestAlgorithms.includes(name)) {
                if (bytes) {
                    // Otherwise, we use our bundled Wasm implementation via digestSync
                    // if it supports the algorithm.
                    return stdCrypto.subtle.digestSync(algorithm, bytes);
                }
                else if (data[Symbol.iterator]) {
                    return stdCrypto.subtle.digestSync(algorithm, data);
                }
                else if (data[Symbol.asyncIterator]) {
                    const wasmCrypto = (0, mod_js_1.instantiateWasm)();
                    const context = new wasmCrypto.DigestContext(name);
                    for await (const chunk of data) {
                        const chunkBytes = bufferSourceBytes(chunk);
                        if (!chunkBytes) {
                            throw new TypeError("data contained chunk of the wrong type");
                        }
                        context.update(chunkBytes);
                    }
                    return context.digestAndDrop(length).buffer;
                }
                else {
                    throw new TypeError("data must be a BufferSource or [Async]Iterable<BufferSource>");
                }
            }
            else if (webCrypto.subtle?.digest) {
                // (TypeScript type definitions prohibit this case.) If they're trying
                // to call an algorithm we don't recognize, pass it along to WebCrypto
                // in case it's a non-standard algorithm supported by the the runtime
                // they're using.
                return webCrypto.subtle.digest(algorithm, data);
            }
            else {
                throw new TypeError(`unsupported digest algorithm: ${algorithm}`);
            }
        },
        digestSync(algorithm, data) {
            algorithm = normalizeAlgorithm(algorithm);
            const bytes = bufferSourceBytes(data);
            if (FNVAlgorithms.includes(algorithm.name)) {
                return (0, index_js_1.fnv)(algorithm.name, bytes);
            }
            const wasmCrypto = (0, mod_js_1.instantiateWasm)();
            if (bytes) {
                return wasmCrypto.digest(algorithm.name, bytes, algorithm.length)
                    .buffer;
            }
            else if (data[Symbol.iterator]) {
                const context = new wasmCrypto.DigestContext(algorithm.name);
                for (const chunk of data) {
                    const chunkBytes = bufferSourceBytes(chunk);
                    if (!chunkBytes) {
                        throw new TypeError("data contained chunk of the wrong type");
                    }
                    context.update(chunkBytes);
                }
                return context.digestAndDrop(algorithm.length).buffer;
            }
            else {
                throw new TypeError("data must be a BufferSource or Iterable<BufferSource>");
            }
        },
        // TODO(@kitsonk): rework when https://github.com/w3c/webcrypto/issues/270 resolved
        timingSafeEqual: timing_safe_equal_js_1.timingSafeEqual,
    },
});
exports.crypto = stdCrypto;
const FNVAlgorithms = ["FNV32", "FNV32A", "FNV64", "FNV64A"];
/** Digest algorithms supported by WebCrypto. */
const webCryptoDigestAlgorithms = [
    "SHA-384",
    "SHA-256",
    "SHA-512",
    // insecure (length-extendable and collidable):
    "SHA-1",
];
const normalizeAlgorithm = (algorithm) => ((typeof algorithm === "string") ? { name: algorithm.toUpperCase() } : {
    ...algorithm,
    name: algorithm.name.toUpperCase(),
});
