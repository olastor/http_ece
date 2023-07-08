"use strict";
// Ported from Go:
// https://github.com/golang/go/tree/go1.13.10/src/hash/fnv/fnv.go
// Copyright 2011 The Go Authors. All rights reserved. BSD license.
// https://github.com/golang/go/blob/master/LICENSE
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
Object.defineProperty(exports, "__esModule", { value: true });
exports.fnv64a = exports.fnv64 = void 0;
const util_js_1 = require("./util.js");
const prime64Lo = 435;
const prime64Hi = 256;
const fnv64 = (data) => {
    let hashLo = 2216829733;
    let hashHi = 3421674724;
    data.forEach((c) => {
        [hashHi, hashLo] = (0, util_js_1.mul64)([hashHi, hashLo], [prime64Hi, prime64Lo]);
        hashLo ^= c;
    });
    return new Uint32Array([(0, util_js_1.swap32)(hashHi >>> 0), (0, util_js_1.swap32)(hashLo >>> 0)]).buffer;
};
exports.fnv64 = fnv64;
const fnv64a = (data) => {
    let hashLo = 2216829733;
    let hashHi = 3421674724;
    data.forEach((c) => {
        hashLo ^= c;
        [hashHi, hashLo] = (0, util_js_1.mul64)([hashHi, hashLo], [prime64Hi, prime64Lo]);
    });
    return new Uint32Array([(0, util_js_1.swap32)(hashHi >>> 0), (0, util_js_1.swap32)(hashLo >>> 0)]).buffer;
};
exports.fnv64a = fnv64a;
