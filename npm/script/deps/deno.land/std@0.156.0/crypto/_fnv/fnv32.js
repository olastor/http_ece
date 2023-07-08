"use strict";
// Ported from Go:
// https://github.com/golang/go/tree/go1.13.10/src/hash/fnv/fnv.go
// Copyright 2011 The Go Authors. All rights reserved. BSD license.
// https://github.com/golang/go/blob/master/LICENSE
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnv32a = exports.fnv32 = void 0;
const util_js_1 = require("./util.js");
const prime32 = 16777619;
const fnv32 = (data) => {
    let hash = 2166136261;
    data.forEach((c) => {
        hash = (0, util_js_1.mul32)(hash, prime32);
        hash ^= c;
    });
    return Uint32Array.from([(0, util_js_1.swap32)(hash)]).buffer;
};
exports.fnv32 = fnv32;
const fnv32a = (data) => {
    let hash = 2166136261;
    data.forEach((c) => {
        hash ^= c;
        hash = (0, util_js_1.mul32)(hash, prime32);
    });
    return Uint32Array.from([(0, util_js_1.swap32)(hash)]).buffer;
};
exports.fnv32a = fnv32a;
