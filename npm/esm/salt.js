import * as dntShim from "./_dnt.shims.js";
import { bytes } from "./deps.js";
import { SALT_LENGTH } from "./const.js";
export class SaltLengthError extends Error {
}
export class Salt extends Uint8Array {
    constructor(salt) {
        if (salt === undefined) {
            super(SALT_LENGTH);
            dntShim.crypto.getRandomValues(this);
            return;
        }
        if (salt.byteLength != SALT_LENGTH) {
            throw new SaltLengthError(`salt length must be ${SALT_LENGTH}: got ${salt.byteLength}`);
        }
        if (salt instanceof ArrayBuffer) {
            const copy = new Uint8Array(SALT_LENGTH);
            bytes.copy(new Uint8Array(salt), copy);
            super(copy);
            return;
        }
        super(SALT_LENGTH);
        this.set(salt, 0);
    }
    equals(other) {
        return bytes.equals(this, other);
    }
}
