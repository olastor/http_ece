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
import * as dntShim from "../../../../_dnt.shims.js";
import { DigestAlgorithm as WasmDigestAlgorithm } from "./_wasm_crypto/mod.js";
export { type Data, type Key, KeyStack } from "./keystack.js";
/** Extensions to the web standard `SubtleCrypto` interface. */
export interface StdSubtleCrypto extends dntShim.SubtleCrypto {
    /**
     * Returns a new `Promise` object that will digest `data` using the specified
     * `AlgorithmIdentifier`.
     */
    digest(algorithm: DigestAlgorithm, data: dntShim.BufferSource | AsyncIterable<dntShim.BufferSource> | Iterable<dntShim.BufferSource>): Promise<ArrayBuffer>;
    /**
     * Returns a ArrayBuffer with the result of digesting `data` using the
     * specified `AlgorithmIdentifier`.
     */
    digestSync(algorithm: DigestAlgorithm, data: dntShim.BufferSource | Iterable<dntShim.BufferSource>): ArrayBuffer;
    /** Compare to array buffers or data views in a way that timing based attacks
     * cannot gain information about the platform. */
    timingSafeEqual(a: ArrayBufferLike | DataView, b: ArrayBufferLike | DataView): boolean;
}
/** Extensions to the Web {@linkcode Crypto} interface. */
export interface StdCrypto extends dntShim.Crypto {
    readonly subtle: StdSubtleCrypto;
}
/**
 * An wrapper for WebCrypto adding support for additional non-standard
 * algorithms, but delegating to the runtime WebCrypto implementation whenever
 * possible.
 */
declare const stdCrypto: StdCrypto;
declare const FNVAlgorithms: string[];
type FNVAlgorithms = "FNV32" | "FNV32A" | "FNV64" | "FNV64A";
type DigestAlgorithmName = WasmDigestAlgorithm | FNVAlgorithms;
type DigestAlgorithmObject = {
    name: DigestAlgorithmName;
    length?: number;
};
type DigestAlgorithm = DigestAlgorithmName | DigestAlgorithmObject;
export { stdCrypto as crypto };
