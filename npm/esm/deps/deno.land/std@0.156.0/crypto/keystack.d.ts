/** Types of data that can be signed cryptographically. */
export type Data = string | number[] | ArrayBuffer | Uint8Array;
/** Types of keys that can be used to sign data. */
export type Key = string | number[] | ArrayBuffer | Uint8Array;
/** A cryptographic key chain which allows signing of data to prevent tampering,
 * but also allows for easy key rotation without needing to re-sign the data.
 *
 * Data is signed as SHA256 HMAC.
 *
 * This was inspired by [keygrip](https://github.com/crypto-utils/keygrip/).
 *
 * ### Example
 *
 * ```ts
 * import { KeyStack } from "https://deno.land/std@$STD_VERSION/crypto/keystack.ts";
 *
 * const keyStack = new KeyStack(["hello", "world"]);
 * const digest = await keyStack.sign("some data");
 *
 * const rotatedStack = new KeyStack(["deno", "says", "hello", "world"]);
 * await rotatedStack.verify("some data", digest); // true
 * ```
 */
export declare class KeyStack {
    #private;
    get length(): number;
    /** A class which accepts an array of keys that are used to sign and verify
     * data and allows easy key rotation without invalidation of previously signed
     * data.
     *
     * @param keys An iterable of keys, of which the index 0 will be used to sign
     *             data, but verification can happen against any key.
     */
    constructor(keys: Iterable<Key>);
    /** Take `data` and return a SHA256 HMAC digest that uses the current 0 index
     * of the `keys` passed to the constructor.  This digest is in the form of a
     * URL safe base64 encoded string. */
    sign(data: Data): Promise<string>;
    /** Given `data` and a `digest`, verify that one of the `keys` provided the
     * constructor was used to generate the `digest`.  Returns `true` if one of
     * the keys was used, otherwise `false`. */
    verify(data: Data, digest: string): Promise<boolean>;
    /** Given `data` and a `digest`, return the current index of the key in the
     * `keys` passed the constructor that was used to generate the digest.  If no
     * key can be found, the method returns `-1`. */
    indexOf(data: Data, digest: string): Promise<number>;
}
