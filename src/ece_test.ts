import * as dntShim from "./_dnt.test_shims.js";
import { assert } from "./dev_deps.js";
import { base64url, bytes } from "./deps.js";

import { decrypt, encrypt } from "./ece.js";
import { Header } from "./header.js";
import { WithPaddingRecordIterable } from "./mod.js";

dntShim.Deno.test("encrypt/RFC8188/Example1", async () => {
  const input = new TextEncoder().encode("I am the walrus");
  const header = Header.fromBase64Url("I1BsxtFttlv3u_Oo94xnmwAAEAAA");
  const secret = base64url.decode("yqdlZ-tYemfogSmv7Ws5PQ");

  const result = await encrypt(input, secret, { header });

  assert(
    bytes.equals(
      new Uint8Array(result),
      base64url.decode(
        "I1BsxtFttlv3u_Oo94xnmwAAEAAA-NAVub2qFgBEuQKRapoZu-IxkIva3MEB1PD-ly8Thjg",
      ),
    ),
  );
});

dntShim.Deno.test("encrypt/RFC8188/Example2", async () => {
  const input = new TextEncoder().encode("I am the walrus");
  const header = Header.fromBase64Url("uNCkWiNYzKTnBN9ji3-qWAAAABkCYTE");
  const secret = base64url.decode("BO3ZVPxUlnLORbVGMpbT1Q");
  const recordIterable = new WithPaddingRecordIterable(input, header.rs, 1);

  const result = await encrypt(recordIterable, secret, { header });

  assert(
    bytes.equals(
      new Uint8Array(result),
      base64url.decode(
        "uNCkWiNYzKTnBN9ji3-qWAAAABkCYTHOG8chz_gnvgOqdGYovxyjuqRyJFjEDyoF1Fvkj6hQPdPHI51OEUKEpgz3SsLWIqS_uA",
      ),
    ),
  );
});

dntShim.Deno.test("decrypt/RFC8188/Example1", async () => {
  const input = base64url.decode(
    "I1BsxtFttlv3u_Oo94xnmwAAEAAA-NAVub2qFgBEuQKRapoZu-IxkIva3MEB1PD-ly8Thjg",
  );
  const secret = base64url.decode("yqdlZ-tYemfogSmv7Ws5PQ");

  const result = await decrypt(input.buffer, secret);

  assert(
    bytes.equals(
      new Uint8Array(result),
      base64url.decode(
        "SSBhbSB0aGUgd2FscnVz",
      ),
    ),
  );
});

dntShim.Deno.test("decrypt/RFC8188/Example2", async () => {
  const input = base64url.decode(
    "uNCkWiNYzKTnBN9ji3-qWAAAABkCYTHOG8chz_gnvgOqdGYovxyjuqRyJFjEDyoF1Fvkj6hQPdPHI51OEUKEpgz3SsLWIqS_uA",
  );
  const secret = base64url.decode("BO3ZVPxUlnLORbVGMpbT1Q");

  const result = await decrypt(input.buffer, secret);

  assert(
    bytes.equals(
      new Uint8Array(result),
      base64url.decode(
        "SSBhbSB0aGUgd2FscnVz",
      ),
    ),
  );
});
