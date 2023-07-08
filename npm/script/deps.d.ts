export { crypto } from "./deps/deno.land/std@0.156.0/crypto/mod.js";
export * as base64url from "./deps/deno.land/std@0.156.0/encoding/base64url.js";
export * as base64 from "./deps/deno.land/std@0.156.0/encoding/base64.js";
import * as bytesMod from "./deps/deno.land/std@0.156.0/bytes/mod.js";
import { equalsNaive } from "./deps/deno.land/std@0.156.0/bytes/equals.js";
export declare const bytes: {
    equalsNaive: typeof equalsNaive;
    indexOfNeedle(source: Uint8Array, needle: Uint8Array, start?: number): number;
    lastIndexOfNeedle(source: Uint8Array, needle: Uint8Array, start?: number): number;
    startsWith(source: Uint8Array, prefix: Uint8Array): boolean;
    endsWith(source: Uint8Array, suffix: Uint8Array): boolean;
    repeat(source: Uint8Array, count: number): Uint8Array;
    concat(...buf: Uint8Array[]): Uint8Array;
    includesNeedle(source: Uint8Array, needle: Uint8Array, start?: number): boolean;
    copy(src: Uint8Array, dst: Uint8Array, off?: number): number;
    equals: typeof bytesMod.equals;
};
