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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECECrypto = exports.Salt = exports.Header = exports.WithPaddingRecordIterable = exports.encrypt = exports.decrypt = void 0;
var ece_js_1 = require("./ece.js");
Object.defineProperty(exports, "decrypt", { enumerable: true, get: function () { return ece_js_1.decrypt; } });
Object.defineProperty(exports, "encrypt", { enumerable: true, get: function () { return ece_js_1.encrypt; } });
Object.defineProperty(exports, "WithPaddingRecordIterable", { enumerable: true, get: function () { return ece_js_1.WithPaddingRecordIterable; } });
var header_js_1 = require("./header.js");
Object.defineProperty(exports, "Header", { enumerable: true, get: function () { return header_js_1.Header; } });
var salt_js_1 = require("./salt.js");
Object.defineProperty(exports, "Salt", { enumerable: true, get: function () { return salt_js_1.Salt; } });
var ece_crypto_js_1 = require("./ece_crypto.js");
Object.defineProperty(exports, "ECECrypto", { enumerable: true, get: function () { return ece_crypto_js_1.ECECrypto; } });
__exportStar(require("./const.js"), exports);
