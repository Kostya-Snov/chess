import { InvalidOperationError } from "./InvalidOperationError";


class CSSClassBuilder {
    private readonly classes: string[] = [];


    public constructor(public readonly moduleClasses: CSSModuleClasses) {
    }


    public get class(): string | undefined {
        const { classes } = this;
        return classes.length === 0 ? undefined : classes.join(" ");
    }


    public addRaw(class_: string | undefined): this {
        if (class_ !== undefined) {
            this.classes.push(class_);
        }
        return this;
    }


    public add(id: string | undefined, moduleClasses = this.moduleClasses): this {
        if (id !== undefined) {
            this.classes.push(moduleClasses.get(id));
        }
        return this;
    }


    public addIf(condition: boolean, id: string, moduleClasses = this.moduleClasses): this {
        return condition ? this.add(id, moduleClasses) : this;
    }
}

export { type CSSClassBuilder };


export type UncheckedCSSModuleClasses = {
    readonly [k: string]: string;
};

declare const brandKey: unique symbol;

export class CSSModuleClasses {
    declare private readonly [brandKey]: never;


    public constructor(public readonly unchecked: UncheckedCSSModuleClasses) {
    }


    public get(id: string): string {
        const class_ = this.unchecked[id];
        if (class_ !== undefined) {
            return class_;
        }
        throw new InvalidOperationError(`Class with id '${id}' does not exist.`);
    }


    public build(): CSSClassBuilder;

    public build(firstId: string, secondId: string, ...otherIds: string[]): string;

    public build(...ids: string[]): CSSClassBuilder | string;

    public build(...ids: readonly string[]): CSSClassBuilder | string {
        const builder = new CSSClassBuilder(this);

        if (ids.length === 0) {
            return builder;
        }

        for (const id of ids) {
            builder.add(id);
        }
        return builder.class!;
    }
}
