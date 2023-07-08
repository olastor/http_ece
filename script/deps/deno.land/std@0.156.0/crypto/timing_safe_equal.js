"use strict";
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.timingSafeEqual = void 0;
const asserts_js_1 = require("../testing/asserts.js");
/** Compare to array buffers or data views in a way that timing based attacks
 * cannot gain information about the platform. */
function timingSafeEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    if (!(a instanceof DataView)) {
        a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
    }
    if (!(b instanceof DataView)) {
        b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
    }
    (0, asserts_js_1.assert)(a instanceof DataView);
    (0, asserts_js_1.assert)(b instanceof DataView);
    const length = a.byteLength;
    let out = 0;
    let i = -1;
    while (++i < length) {
        out |= a.getUint8(i) ^ b.getUint8(i);
    }
    return out === 0;
}
exports.timingSafeEqual = timingSafeEqual;
