"use strict";
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnv = void 0;
const fnv32_js_1 = require("./fnv32.js");
const fnv64_js_1 = require("./fnv64.js");
const fnv = (name, buf) => {
    if (!buf) {
        throw new TypeError("no data provided for hashing");
    }
    switch (name) {
        case "FNV32":
            return (0, fnv32_js_1.fnv32)(buf);
        case "FNV64":
            return (0, fnv64_js_1.fnv64)(buf);
        case "FNV32A":
            return (0, fnv32_js_1.fnv32a)(buf);
        case "FNV64A":
            return (0, fnv64_js_1.fnv64a)(buf);
        default:
            throw new TypeError(`unsupported fnv digest: ${name}`);
    }
};
exports.fnv = fnv;
