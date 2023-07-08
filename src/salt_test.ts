import * as dntShim from "./_dnt.test_shims.js";
import { bytes } from "./deps.js";
import { assert, assertFalse, assertThrows } from "./dev_deps.js";
import { SALT_LENGTH } from "./const.js";
import { Salt, SaltLengthError } from "./salt.js";

dntShim.Deno.test("Salt/constructor/default", () => {
  const salt = new Salt();
  assert(salt.length === SALT_LENGTH);

  const other = new Salt();
  assertFalse(bytes.equals(salt, other));
});

dntShim.Deno.test("Salt/constructor/Uint8Array", () => {
  const buf = new Uint8Array(SALT_LENGTH);
  dntShim.crypto.getRandomValues(buf);

  const salt = new Salt(buf);
  assert(salt.length === SALT_LENGTH);
  assert(salt.every((_, i) => salt.at(i) === buf.at(i)));

  // Ensure buffer was copied
  dntShim.crypto.getRandomValues(buf);
  assertFalse(salt.every((_, i) => salt.at(i) === buf.at(i)));
});

dntShim.Deno.test("Salt/constructor/Uint8Array/InvalidLength", () => {
  for (const saltLength of [SALT_LENGTH - 1, SALT_LENGTH + 1]) {
    const buf = new Uint8Array(saltLength);
    dntShim.crypto.getRandomValues(buf);

    assertThrows(() => {
      new Salt(buf);
    }, SaltLengthError);
  }
});

dntShim.Deno.test("Salt/constructor/ArrayBuffer", () => {
  const arr = new Uint8Array(SALT_LENGTH);
  dntShim.crypto.getRandomValues(arr);

  const salt = new Salt(arr.buffer);
  assert(salt.length === SALT_LENGTH);
  assert(salt.every((_, i) => salt.at(i) === arr.at(i)));

  // Ensure buffer was copied
  dntShim.crypto.getRandomValues(arr);
  assertFalse(salt.every((_, i) => salt.at(i) === arr.at(i)));
});

dntShim.Deno.test("Salt/constructor/ArrayBuffer/InvalidLength", () => {
  for (const saltLength of [SALT_LENGTH - 1, SALT_LENGTH + 1]) {
    const buf = new Uint8Array(saltLength);
    const dv = new DataView(buf.buffer);
    for (let i = 0; i < saltLength; i++) {
      dv.setUint8(i, Math.floor(Math.random() * 255));
    }

    assertThrows(() => {
      new Salt(buf.buffer);
    }, SaltLengthError);
  }
});

dntShim.Deno.test("Salt/equal", () => {
  const h1 = new Salt();
  assert(h1.equals(h1));

  const h2 = new Salt(h1);
  assert(h1.equals(h2));

  dntShim.crypto.getRandomValues(h2);
  assertFalse(h1.equals(h2));
});
