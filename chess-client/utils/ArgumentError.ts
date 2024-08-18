declare const brandKey: unique symbol;

export class ArgumentError extends Error {
    declare private readonly [brandKey]: never;


    public readonly parameterNames: readonly string[];


    public constructor(message: string, parameterNames?: string | Iterable<string>) {
        super(message);
        this.parameterNames =
            parameterNames === undefined
                ? []
                : typeof parameterNames === "string"
                    ? [parameterNames]
                    : [...parameterNames];
    }
}
