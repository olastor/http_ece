export declare class SaltLengthError extends Error {
}
export declare class Salt extends Uint8Array {
    constructor(salt?: Uint8Array | ArrayBuffer);
    equals(other: Salt): boolean;
}
