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
const dntShim = __importStar(require("./_dnt.test_shims.js"));
const dev_deps_js_1 = require("./dev_deps.js");
const deps_js_1 = require("./deps.js");
const ece_crypto_js_1 = require("./ece_crypto.js");
const header_js_1 = require("./header.js");
dntShim.Deno.test("ECECrypto/encryptRecord/RFC8188/Example1", async () => {
    const input = new TextEncoder().encode("I am the walrus");
    const header = header_js_1.Header.fromBase64Url("I1BsxtFttlv3u_Oo94xnmwAAEAAA");
    const secret = deps_js_1.base64url.decode("yqdlZ-tYemfogSmv7Ws5PQ");
    const crypto = new ece_crypto_js_1.ECECrypto(secret, { header });
    const record = await crypto.encryptRecord(deps_js_1.bytes.concat(input, Uint8Array.of(0x02)), // add padding
    0);
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(new Uint8Array(record), deps_js_1.base64url.decode("-NAVub2qFgBEuQKRapoZu-IxkIva3MEB1PD-ly8Thjg")));
});
dntShim.Deno.test("ECECrypto/encryptRecord/RFC8188/Example2", async () => {
    const input = new TextEncoder().encode("I am the walrus");
    const header = header_js_1.Header.fromBase64Url("uNCkWiNYzKTnBN9ji3-qWAAAABkCYTE");
    const secret = deps_js_1.base64url.decode("BO3ZVPxUlnLORbVGMpbT1Q");
    const crypto = new ece_crypto_js_1.ECECrypto(secret, { header });
    const firstRecord = await crypto.encryptRecord(deps_js_1.bytes.concat(input.slice(0, 7), Uint8Array.of(0x01, 0x0)), 0);
    const secondRecord = await crypto.encryptRecord(deps_js_1.bytes.concat(input.slice(7), Uint8Array.of(0x02)), 1);
    const result = deps_js_1.bytes.concat(new Uint8Array(firstRecord), new Uint8Array(secondRecord));
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(result, deps_js_1.base64url.decode("zhvHIc_4J74DqnRmKL8co7qkciRYxA8qBdRb5I-oUD3TxyOdThFChKYM90rC1iKkv7g")));
});
dntShim.Deno.test("ECECrypto/decryptRecord/RFC8188/Example1", async () => {
    const input = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmwAAEAAA-NAVub2qFgBEuQKRapoZu-IxkIva3MEB1PD-ly8Thjg");
    const header = header_js_1.Header.fromBytes(input.buffer);
    const secret = deps_js_1.base64url.decode("yqdlZ-tYemfogSmv7Ws5PQ");
    const crypto = new ece_crypto_js_1.ECECrypto(secret, { header });
    const record = await crypto.decryptRecord(input.slice(header.byteLength), 0);
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(new Uint8Array(record), deps_js_1.base64url.decode("SSBhbSB0aGUgd2FscnVzAg")));
});
dntShim.Deno.test("ECECrypto/decryptRecord/RFC8188/Example2", async () => {
    const input = deps_js_1.base64url.decode("uNCkWiNYzKTnBN9ji3-qWAAAABkCYTHOG8chz_gnvgOqdGYovxyjuqRyJFjEDyoF1Fvkj6hQPdPHI51OEUKEpgz3SsLWIqS_uA");
    const header = header_js_1.Header.fromBytes(input.buffer);
    const secret = deps_js_1.base64url.decode("BO3ZVPxUlnLORbVGMpbT1Q");
    const crypto = new ece_crypto_js_1.ECECrypto(secret, { header });
    const firstRecord = await crypto.decryptRecord(input.slice(header.byteLength, header.byteLength + header.rs), 0);
    const secondRecord = await crypto.decryptRecord(input.slice(header.byteLength + header.rs), 1);
    const result = deps_js_1.bytes.concat(new Uint8Array(firstRecord), new Uint8Array(secondRecord));
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(result, deps_js_1.base64url.decode("SSBhbSB0aAEAZSB3YWxydXMC")));
});
