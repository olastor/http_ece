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
exports.bytes = exports.base64 = exports.base64url = exports.crypto = void 0;
var mod_js_1 = require("./deps/deno.land/std@0.156.0/crypto/mod.js");
Object.defineProperty(exports, "crypto", { enumerable: true, get: function () { return mod_js_1.crypto; } });
exports.base64url = __importStar(require("./deps/deno.land/std@0.156.0/encoding/base64url.js"));
exports.base64 = __importStar(require("./deps/deno.land/std@0.156.0/encoding/base64.js"));
const bytesMod = __importStar(require("./deps/deno.land/std@0.156.0/bytes/mod.js"));
const equals_js_1 = require("./deps/deno.land/std@0.156.0/bytes/equals.js");
exports.bytes = {
    ...bytesMod,
    equalsNaive: equals_js_1.equalsNaive,
};
