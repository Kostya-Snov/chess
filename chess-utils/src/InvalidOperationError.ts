declare const brandKey: unique symbol;

export class InvalidOperationError extends Error {
    declare private readonly [brandKey]: never;


    public constructor(message?: string) {
        super(message ?? "Invalid operation.");
    }
}
