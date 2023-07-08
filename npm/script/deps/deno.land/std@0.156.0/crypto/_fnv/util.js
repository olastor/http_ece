"use strict";
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
Object.defineProperty(exports, "__esModule", { value: true });
exports.mul64 = exports.mul32 = exports.swap32 = void 0;
function swap32(val) {
    return (((val & 0xff) << 24) |
        ((val & 0xff00) << 8) |
        ((val >> 8) & 0xff00) |
        ((val >> 24) & 0xff));
}
exports.swap32 = swap32;
function n16(n) {
    return n & 0xffff;
}
function n32(n) {
    return n >>> 0;
}
function add32WithCarry(a, b) {
    const added = n32(a) + n32(b);
    return [n32(added), added > 0xffffffff ? 1 : 0];
}
function mul32WithCarry(a, b) {
    const al = n16(a);
    const ah = n16(a >>> 16);
    const bl = n16(b);
    const bh = n16(b >>> 16);
    const [t, tc] = add32WithCarry(al * bh, ah * bl);
    const [n, nc] = add32WithCarry(al * bl, n32(t << 16));
    const carry = nc + (tc << 16) + n16(t >>> 16) + ah * bh;
    return [n, carry];
}
/**
 * mul32 performs 32-bit multiplication, a * b
 * @param a
 * @param b
 */
function mul32(a, b) {
    // https://stackoverflow.com/a/28151933
    const al = n16(a);
    const ah = a - al;
    return n32(n32(ah * b) + al * b);
}
exports.mul32 = mul32;
/**
 * mul64 performs 64-bit multiplication with two 32-bit words
 * @param [ah, al]
 * @param [bh, bl]
 */
function mul64([ah, al], [bh, bl]) {
    const [n, c] = mul32WithCarry(al, bl);
    return [n32(mul32(al, bh) + mul32(ah, bl) + c), n];
}
exports.mul64 = mul64;
