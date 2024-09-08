import { CSSModuleClasses } from "chess-utils";
import { type FC, type ReactNode, useEffect, useRef, useState } from "react";
import uncheckedClasses from "../Modal.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type ModalProps = {
    readonly className?: string | undefined;
    readonly isOpen: boolean;
    readonly onClosingEnd?: (() => void) | undefined;
    readonly children?: ReactNode;
};

export const Modal: FC<ModalProps> = ({ className, isOpen, onClosingEnd, children }) => {
    const containerElementRef = useRef<HTMLDivElement>(null);
    const [isCompletelyClosed, setIsCompletelyClosed] = useState(!isOpen);

    useEffect(() => {
        const containerElement = containerElementRef.current!;

        const withIndicator = (callback: () => void) => (event: TransitionEvent): void => {
            const enum Constants {
                IndicatorPropertyName = "background-color"
            }

            if (
                event.target === containerElement
                && event.propertyName === Constants.IndicatorPropertyName
            ) {
                callback();
            }
        };

        if (isOpen) {
            const handle = withIndicator(() => setIsCompletelyClosed(false));
            containerElement.addEventListener("transitionstart", handle);
            return () => containerElement.removeEventListener("transitionstart", handle);
        } else {
            const handle = withIndicator(() => {
                onClosingEnd?.();
                setIsCompletelyClosed(true);
            });
            containerElement.addEventListener("transitionend", handle);
            return () => containerElement.removeEventListener("transitionend", handle);
        }
    }, [onClosingEnd, isOpen]);

    return (
        <div
            ref={containerElementRef}
            className={
                classes.build()
                    .add("container")
                    .addIf(isOpen, "open")
                    .addIf(isCompletelyClosed, "completelyClosed")
                    .class
            }
        >
            <div className={classes.build().add("content").addRaw(className).class}>
                {children}
            </div>
        </div>
    );
};
