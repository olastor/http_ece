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
const ece_js_1 = require("./ece.js");
const header_js_1 = require("./header.js");
const mod_js_1 = require("./mod.js");
dntShim.Deno.test("encrypt/RFC8188/Example1", async () => {
    const input = new TextEncoder().encode("I am the walrus");
    const header = header_js_1.Header.fromBase64Url("I1BsxtFttlv3u_Oo94xnmwAAEAAA");
    const secret = deps_js_1.base64url.decode("yqdlZ-tYemfogSmv7Ws5PQ");
    const result = await (0, ece_js_1.encrypt)(input, secret, { header });
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(new Uint8Array(result), deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmwAAEAAA-NAVub2qFgBEuQKRapoZu-IxkIva3MEB1PD-ly8Thjg")));
});
dntShim.Deno.test("encrypt/RFC8188/Example2", async () => {
    const input = new TextEncoder().encode("I am the walrus");
    const header = header_js_1.Header.fromBase64Url("uNCkWiNYzKTnBN9ji3-qWAAAABkCYTE");
    const secret = deps_js_1.base64url.decode("BO3ZVPxUlnLORbVGMpbT1Q");
    const recordIterable = new mod_js_1.WithPaddingRecordIterable(input, header.rs, 1);
    const result = await (0, ece_js_1.encrypt)(recordIterable, secret, { header });
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(new Uint8Array(result), deps_js_1.base64url.decode("uNCkWiNYzKTnBN9ji3-qWAAAABkCYTHOG8chz_gnvgOqdGYovxyjuqRyJFjEDyoF1Fvkj6hQPdPHI51OEUKEpgz3SsLWIqS_uA")));
});
dntShim.Deno.test("decrypt/RFC8188/Example1", async () => {
    const input = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmwAAEAAA-NAVub2qFgBEuQKRapoZu-IxkIva3MEB1PD-ly8Thjg");
    const secret = deps_js_1.base64url.decode("yqdlZ-tYemfogSmv7Ws5PQ");
    const result = await (0, ece_js_1.decrypt)(input.buffer, secret);
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(new Uint8Array(result), deps_js_1.base64url.decode("SSBhbSB0aGUgd2FscnVz")));
});
dntShim.Deno.test("decrypt/RFC8188/Example2", async () => {
    const input = deps_js_1.base64url.decode("uNCkWiNYzKTnBN9ji3-qWAAAABkCYTHOG8chz_gnvgOqdGYovxyjuqRyJFjEDyoF1Fvkj6hQPdPHI51OEUKEpgz3SsLWIqS_uA");
    const secret = deps_js_1.base64url.decode("BO3ZVPxUlnLORbVGMpbT1Q");
    const result = await (0, ece_js_1.decrypt)(input.buffer, secret);
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(new Uint8Array(result), deps_js_1.base64url.decode("SSBhbSB0aGUgd2FscnVz")));
});
