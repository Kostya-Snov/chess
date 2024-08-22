declare const brandKey: unique symbol;

export class AssertionError extends Error {
    declare private readonly [brandKey]: never;


    public constructor(message?: string) {
        super(message ?? "Assertion failed.");
    }
}

export const assert: (isTrue: unknown, message?: string) => asserts isTrue = (isTrue, message) => {
    if (!isTrue) {
        throw new AssertionError(message);
    }
};
