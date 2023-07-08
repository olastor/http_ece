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
exports.Salt = exports.SaltLengthError = void 0;
const dntShim = __importStar(require("./_dnt.shims.js"));
const deps_js_1 = require("./deps.js");
const const_js_1 = require("./const.js");
class SaltLengthError extends Error {
}
exports.SaltLengthError = SaltLengthError;
class Salt extends Uint8Array {
    constructor(salt) {
        if (salt === undefined) {
            super(const_js_1.SALT_LENGTH);
            dntShim.crypto.getRandomValues(this);
            return;
        }
        if (salt.byteLength != const_js_1.SALT_LENGTH) {
            throw new SaltLengthError(`salt length must be ${const_js_1.SALT_LENGTH}: got ${salt.byteLength}`);
        }
        if (salt instanceof ArrayBuffer) {
            const copy = new Uint8Array(const_js_1.SALT_LENGTH);
            deps_js_1.bytes.copy(new Uint8Array(salt), copy);
            super(copy);
            return;
        }
        super(const_js_1.SALT_LENGTH);
        this.set(salt, 0);
    }
    equals(other) {
        return deps_js_1.bytes.equals(this, other);
    }
}
exports.Salt = Salt;
