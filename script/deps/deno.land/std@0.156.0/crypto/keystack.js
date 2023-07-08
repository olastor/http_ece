"use strict";
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _KeyStack_instances, _KeyStack_cryptoKeys, _KeyStack_keys, _KeyStack_toCryptoKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStack = void 0;
/**
 * Provides the {@linkcode KeyStack} class which implements the
 * {@linkcode KeyRing} interface for managing rotatable keys.
 *
 * @module
 */
const dntShim = __importStar(require("../../../../_dnt.shims.js"));
const timing_safe_equal_js_1 = require("./timing_safe_equal.js");
const base64url = __importStar(require("../encoding/base64url.js"));
const encoder = new TextEncoder();
function importKey(key) {
    if (typeof key === "string") {
        key = encoder.encode(key);
    }
    else if (Array.isArray(key)) {
        key = new Uint8Array(key);
    }
    return dntShim.crypto.subtle.importKey("raw", key, {
        name: "HMAC",
        hash: { name: "SHA-256" },
    }, true, ["sign", "verify"]);
}
function sign(data, key) {
    if (typeof data === "string") {
        data = encoder.encode(data);
    }
    else if (Array.isArray(data)) {
        data = Uint8Array.from(data);
    }
    return dntShim.crypto.subtle.sign("HMAC", key, data);
}
/** Compare two strings, Uint8Arrays, ArrayBuffers, or arrays of numbers in a
 * way that avoids timing based attacks on the comparisons on the values.
 *
 * The function will return `true` if the values match, or `false`, if they
 * do not match.
 *
 * This was inspired by https://github.com/suryagh/tsscmp which provides a
 * timing safe string comparison to avoid timing attacks as described in
 * https://codahale.com/a-lesson-in-timing-attacks/.
 */
async function compare(a, b) {
    const key = new Uint8Array(32);
    dntShim.dntGlobalThis.crypto.getRandomValues(key);
    const cryptoKey = await importKey(key);
    const ah = await sign(a, cryptoKey);
    const bh = await sign(b, cryptoKey);
    return (0, timing_safe_equal_js_1.timingSafeEqual)(ah, bh);
}
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
class KeyStack {
    get length() {
        return __classPrivateFieldGet(this, _KeyStack_keys, "f").length;
    }
    /** A class which accepts an array of keys that are used to sign and verify
     * data and allows easy key rotation without invalidation of previously signed
     * data.
     *
     * @param keys An iterable of keys, of which the index 0 will be used to sign
     *             data, but verification can happen against any key.
     */
    constructor(keys) {
        _KeyStack_instances.add(this);
        _KeyStack_cryptoKeys.set(this, new Map());
        _KeyStack_keys.set(this, void 0);
        const values = Array.isArray(keys) ? keys : [...keys];
        if (!(values.length)) {
            throw new TypeError("keys must contain at least one value");
        }
        __classPrivateFieldSet(this, _KeyStack_keys, values, "f");
    }
    /** Take `data` and return a SHA256 HMAC digest that uses the current 0 index
     * of the `keys` passed to the constructor.  This digest is in the form of a
     * URL safe base64 encoded string. */
    async sign(data) {
        const key = await __classPrivateFieldGet(this, _KeyStack_instances, "m", _KeyStack_toCryptoKey).call(this, __classPrivateFieldGet(this, _KeyStack_keys, "f")[0]);
        return base64url.encode(await sign(data, key));
    }
    /** Given `data` and a `digest`, verify that one of the `keys` provided the
     * constructor was used to generate the `digest`.  Returns `true` if one of
     * the keys was used, otherwise `false`. */
    async verify(data, digest) {
        return (await this.indexOf(data, digest)) > -1;
    }
    /** Given `data` and a `digest`, return the current index of the key in the
     * `keys` passed the constructor that was used to generate the digest.  If no
     * key can be found, the method returns `-1`. */
    async indexOf(data, digest) {
        for (let i = 0; i < __classPrivateFieldGet(this, _KeyStack_keys, "f").length; i++) {
            const cryptoKey = await __classPrivateFieldGet(this, _KeyStack_instances, "m", _KeyStack_toCryptoKey).call(this, __classPrivateFieldGet(this, _KeyStack_keys, "f")[i]);
            if (await compare(digest, base64url.encode(await sign(data, cryptoKey)))) {
                return i;
            }
        }
        return -1;
    }
    [(_KeyStack_cryptoKeys = new WeakMap(), _KeyStack_keys = new WeakMap(), _KeyStack_instances = new WeakSet(), _KeyStack_toCryptoKey = async function _KeyStack_toCryptoKey(key) {
        if (!__classPrivateFieldGet(this, _KeyStack_cryptoKeys, "f").has(key)) {
            __classPrivateFieldGet(this, _KeyStack_cryptoKeys, "f").set(key, await importKey(key));
        }
        return __classPrivateFieldGet(this, _KeyStack_cryptoKeys, "f").get(key);
    }, Symbol.for("Deno.customInspect"))](inspect) {
        const { length } = this;
        return `${this.constructor.name} ${inspect({ length })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, 
    // deno-lint-ignore no-explicit-any
    options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1,
        });
        const { length } = this;
        return `${options.stylize(this.constructor.name, "special")} ${inspect({ length }, newOptions)}`;
    }
}
exports.KeyStack = KeyStack;
