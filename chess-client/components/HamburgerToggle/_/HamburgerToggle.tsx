import { createArray, CSSModuleClasses, validateNumberArgument } from "chess-utils";
import { type FC } from "react";
import uncheckedClasses from "../HamburgerToggle.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type HamburgerToggleProps = {
    readonly className?: string | undefined;
    readonly isOpen: boolean;
    readonly onClick: () => void;
    readonly numberLines?: number | undefined;
};

export const HamburgerToggle: FC<HamburgerToggleProps> = ({
    className,
    isOpen,
    onClick,
    numberLines = 3
}) => {
    validateNumberArgument(numberLines, "numberLines")
        .isSafeInteger()
        .isGreaterThanOrEqual(2);

    return (
        <span
            className={classes.build().add("toggle").addIf(isOpen, "open").addRaw(className).class}
            style={{
                ["--numberLines" as string]: numberLines
            }}
            onClick={onClick}
        >
            {createArray(numberLines, index => (
                <span
                    key={index}
                    className={classes.get("line")}
                    style={{
                        ["--index" as string]: index
                    }}
                />
            ))}
        </span>
    );
};
