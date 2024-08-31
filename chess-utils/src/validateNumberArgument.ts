import { ArgumentError } from "./ArgumentError";


class NumberArgumentValidator {
    public constructor(
        public readonly value: number,
        public readonly paramName?: string
    ) {
    }


    public isSafeInteger(): this {
        if (!Number.isSafeInteger(this.value)) {
            throw new ArgumentError("Must be safe integer.", this.paramName);
        }

        return this;
    }


    public isGreaterThanOrEqual(min: number): this {
        if (this.value < min) {
            throw new ArgumentError(`Must be greater than or equal to ${min}.`, this.paramName);
        }

        return this;
    }


    public isPositive(): this {
        if (this.value <= 0) {
            throw new ArgumentError("Must be positive.", this.paramName);
        }

        return this;
    }


    public isNonNegative(): this {
        if (this.value < 0) {
            throw new ArgumentError("Must be non-negative.", this.paramName);
        }

        return this;
    }
}

export { type NumberArgumentValidator };


export const validateNumberArgument = (value: number, paramName?: string) =>
    new NumberArgumentValidator(value, paramName);
