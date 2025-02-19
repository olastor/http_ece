// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

import { fnv32, fnv32a } from "./fnv32.js";
import { fnv64, fnv64a } from "./fnv64.js";

export const fnv = (name: string, buf: Uint8Array | undefined): ArrayBuffer => {
  if (!buf) {
    throw new TypeError("no data provided for hashing");
  }

  switch (name) {
    case "FNV32":
      return fnv32(buf);
    case "FNV64":
      return fnv64(buf);
    case "FNV32A":
      return fnv32a(buf);
    case "FNV64A":
      return fnv64a(buf);
    default:
      throw new TypeError(`unsupported fnv digest: ${name}`);
  }
};
