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
const const_js_1 = require("./const.js");
const header_js_1 = require("./header.js");
const salt_js_1 = require("./salt.js");
dntShim.Deno.test("Header/constructor/default", () => {
    const h = new header_js_1.Header({});
    (0, dev_deps_js_1.assert)(h.rs === const_js_1.DEFAULT_RECORD_SIZE);
    (0, dev_deps_js_1.assert)(h.keyid.length === 0);
    (0, dev_deps_js_1.assertFalse)(h.salt === null);
    (0, dev_deps_js_1.assertFalse)(h.salt.equals(new salt_js_1.Salt(new Uint8Array(const_js_1.SALT_LENGTH))));
});
dntShim.Deno.test("Header/constructor/InvalidRecordSize", () => {
    (0, dev_deps_js_1.assertThrows)(() => {
        new header_js_1.Header({ rs: 0 });
    }, header_js_1.RecordSizeError);
    // Min value
    new header_js_1.Header({ rs: 18 });
    // Max value
    new header_js_1.Header({ rs: 2 ** 36 - 31 });
    (0, dev_deps_js_1.assertThrows)(() => {
        new header_js_1.Header({ rs: 2 ** 36 - 30 });
    }, header_js_1.RecordSizeError);
});
dntShim.Deno.test("Header/equal", () => {
    const h1 = new header_js_1.Header({});
    const h2 = new header_js_1.Header({ salt: h1.salt, rs: h1.rs, keyid: h1.keyid });
    (0, dev_deps_js_1.assertEquals)(h1, h2);
    (0, dev_deps_js_1.assert)(h1.equals(h2));
    const h3 = new header_js_1.Header({});
    (0, dev_deps_js_1.assertNotEquals)(h1, h3);
    (0, dev_deps_js_1.assertFalse)(h1.equals(h3));
});
dntShim.Deno.test("Header/not/equal", () => {
    const h1 = new header_js_1.Header({ keyid: Uint8Array.of(66) });
    const h2 = new header_js_1.Header({ keyid: Uint8Array.of(67) });
    (0, dev_deps_js_1.assertNotEquals)(h1, h2);
});
dntShim.Deno.test("Header/toBytes", () => {
    const innerSalt = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmw");
    const salt = new salt_js_1.Salt(innerSalt);
    const h = new header_js_1.Header({ salt, rs: 4096, keyid: new Uint8Array() });
    const rs = Uint8Array.of(0, 0, 16, 0); // 4096
    const idlen = Uint8Array.of(h.idlen);
    (0, dev_deps_js_1.assert)(deps_js_1.bytes.equals(new Uint8Array(h.toBytes()), deps_js_1.bytes.concat(innerSalt, rs, idlen, h.keyid)));
});
dntShim.Deno.test("Header/toBase64", () => {
    const innerSalt = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmw");
    const salt = new salt_js_1.Salt(innerSalt);
    const h = new header_js_1.Header({ salt, rs: 4096, keyid: new Uint8Array() });
    (0, dev_deps_js_1.assert)(h.toBase64() === "I1BsxtFttlv3u/Oo94xnmwAAEAAA");
});
dntShim.Deno.test("Header/toBase64Url", () => {
    const innerSalt = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmw");
    const salt = new salt_js_1.Salt(innerSalt);
    const h = new header_js_1.Header({ salt, rs: 4096, keyid: new Uint8Array() });
    (0, dev_deps_js_1.assert)(h.toBase64Url() === "I1BsxtFttlv3u_Oo94xnmwAAEAAA");
});
dntShim.Deno.test("Header/fromBytes", () => {
    const innerSalt = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmw");
    const salt = new salt_js_1.Salt(innerSalt);
    const h1 = new header_js_1.Header({ salt, rs: 4096, keyid: new Uint8Array() });
    const h2 = header_js_1.Header.fromBytes(h1.toBytes());
    (0, dev_deps_js_1.assertFalse)(h1 === h2);
    (0, dev_deps_js_1.assert)(h1.equals(h2));
});
dntShim.Deno.test("Header/fromBase64", () => {
    const innerSalt = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmw");
    const salt = new salt_js_1.Salt(innerSalt);
    const h1 = new header_js_1.Header({ salt, rs: 4096, keyid: new Uint8Array() });
    const h2 = header_js_1.Header.fromBase64(h1.toBase64());
    (0, dev_deps_js_1.assertFalse)(h1 === h2);
    (0, dev_deps_js_1.assert)(h1.equals(h2));
});
dntShim.Deno.test("Header/fromBase64Url", () => {
    const innerSalt = deps_js_1.base64url.decode("I1BsxtFttlv3u_Oo94xnmw");
    const salt = new salt_js_1.Salt(innerSalt);
    const h1 = new header_js_1.Header({ salt, rs: 4096, keyid: new Uint8Array() });
    const h2 = header_js_1.Header.fromBase64Url(h1.toBase64Url());
    (0, dev_deps_js_1.assertFalse)(h1 === h2);
    (0, dev_deps_js_1.assert)(h1.equals(h2));
});
