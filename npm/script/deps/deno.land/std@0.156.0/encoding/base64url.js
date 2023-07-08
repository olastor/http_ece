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
exports.decode = exports.encode = void 0;
/**
 * {@linkcode encode} and {@linkcode decode} for
 * [base64 URL safe](https://en.wikipedia.org/wiki/Base64#URL_applications) encoding.
 *
 * This module is browser compatible.
 *
 * @module
 */
const base64 = __importStar(require("./base64.js"));
/*
 * Some variants allow or require omitting the padding '=' signs:
 * https://en.wikipedia.org/wiki/Base64#The_URL_applications
 * @param base64url
 */
function addPaddingToBase64url(base64url) {
    if (base64url.length % 4 === 2)
        return base64url + "==";
    if (base64url.length % 4 === 3)
        return base64url + "=";
    if (base64url.length % 4 === 1) {
        throw new TypeError("Illegal base64url string!");
    }
    return base64url;
}
function convertBase64urlToBase64(b64url) {
    if (!/^[-_A-Z0-9]*?={0,2}$/i.test(b64url)) {
        // Contains characters not part of base64url spec.
        throw new TypeError("Failed to decode base64url: invalid character");
    }
    return addPaddingToBase64url(b64url).replace(/\-/g, "+").replace(/_/g, "/");
}
function convertBase64ToBase64url(b64) {
    return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
/**
 * Encodes a given ArrayBuffer or string into a base64url representation
 * @param data
 */
function encode(data) {
    return convertBase64ToBase64url(base64.encode(data));
}
exports.encode = encode;
/**
 * Converts given base64url encoded data back to original
 * @param b64url
 */
function decode(b64url) {
    return base64.decode(convertBase64urlToBase64(b64url));
}
exports.decode = decode;
