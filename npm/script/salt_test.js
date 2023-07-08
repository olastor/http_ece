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
const deps_js_1 = require("./deps.js");
const dev_deps_js_1 = require("./dev_deps.js");
const const_js_1 = require("./const.js");
const salt_js_1 = require("./salt.js");
dntShim.Deno.test("Salt/constructor/default", () => {
    const salt = new salt_js_1.Salt();
    (0, dev_deps_js_1.assert)(salt.length === const_js_1.SALT_LENGTH);
    const other = new salt_js_1.Salt();
    (0, dev_deps_js_1.assertFalse)(deps_js_1.bytes.equals(salt, other));
});
dntShim.Deno.test("Salt/constructor/Uint8Array", () => {
    const buf = new Uint8Array(const_js_1.SALT_LENGTH);
    dntShim.crypto.getRandomValues(buf);
    const salt = new salt_js_1.Salt(buf);
    (0, dev_deps_js_1.assert)(salt.length === const_js_1.SALT_LENGTH);
    (0, dev_deps_js_1.assert)(salt.every((_, i) => salt.at(i) === buf.at(i)));
    // Ensure buffer was copied
    dntShim.crypto.getRandomValues(buf);
    (0, dev_deps_js_1.assertFalse)(salt.every((_, i) => salt.at(i) === buf.at(i)));
});
dntShim.Deno.test("Salt/constructor/Uint8Array/InvalidLength", () => {
    for (const saltLength of [const_js_1.SALT_LENGTH - 1, const_js_1.SALT_LENGTH + 1]) {
        const buf = new Uint8Array(saltLength);
        dntShim.crypto.getRandomValues(buf);
        (0, dev_deps_js_1.assertThrows)(() => {
            new salt_js_1.Salt(buf);
        }, salt_js_1.SaltLengthError);
    }
});
dntShim.Deno.test("Salt/constructor/ArrayBuffer", () => {
    const arr = new Uint8Array(const_js_1.SALT_LENGTH);
    dntShim.crypto.getRandomValues(arr);
    const salt = new salt_js_1.Salt(arr.buffer);
    (0, dev_deps_js_1.assert)(salt.length === const_js_1.SALT_LENGTH);
    (0, dev_deps_js_1.assert)(salt.every((_, i) => salt.at(i) === arr.at(i)));
    // Ensure buffer was copied
    dntShim.crypto.getRandomValues(arr);
    (0, dev_deps_js_1.assertFalse)(salt.every((_, i) => salt.at(i) === arr.at(i)));
});
dntShim.Deno.test("Salt/constructor/ArrayBuffer/InvalidLength", () => {
    for (const saltLength of [const_js_1.SALT_LENGTH - 1, const_js_1.SALT_LENGTH + 1]) {
        const buf = new Uint8Array(saltLength);
        const dv = new DataView(buf.buffer);
        for (let i = 0; i < saltLength; i++) {
            dv.setUint8(i, Math.floor(Math.random() * 255));
        }
        (0, dev_deps_js_1.assertThrows)(() => {
            new salt_js_1.Salt(buf.buffer);
        }, salt_js_1.SaltLengthError);
    }
});
dntShim.Deno.test("Salt/equal", () => {
    const h1 = new salt_js_1.Salt();
    (0, dev_deps_js_1.assert)(h1.equals(h1));
    const h2 = new salt_js_1.Salt(h1);
    (0, dev_deps_js_1.assert)(h1.equals(h2));
    dntShim.crypto.getRandomValues(h2);
    (0, dev_deps_js_1.assertFalse)(h1.equals(h2));
});
