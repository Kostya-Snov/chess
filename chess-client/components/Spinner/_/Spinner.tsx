import { createArray, CSSModuleClasses, validateNumberArgument } from "chess-utils";
import { type FC } from "react";
import uncheckedClasses from "../Spinner.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type SpinnerProps = {
    readonly className?: string | undefined;
    readonly numberCircles?: number | undefined;
};

export const Spinner: FC<SpinnerProps> = ({ className, numberCircles = 12 }) => {
    validateNumberArgument(numberCircles, "numberCircles")
        .isSafeInteger()
        .isPositive();

    return (
        <span
            className={classes.build().add("spinner").addRaw(className).class}
            style={{
                ["--numberCircles" as string]: numberCircles
            }}
        >
            {createArray(numberCircles, index => (
                <span
                    key={index}
                    className={classes.get("circle")}
                    style={{
                        ["--index" as string]: index
                    }}
                />
            ))}
        </span>
    );
};
