"use client";

import { CSSModuleClasses } from "chess-utils";
import { type FC, type ReactNode, useEffect, useRef } from "react";
import uncheckedClasses from "../WidthOverflowContainer.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type WidthOverflowContainerProps = {
    readonly className?: string | undefined;
    readonly children?: ReactNode;
};

export const WidthOverflowContainer: FC<WidthOverflowContainerProps> = ({
    className,
    children
}) => {
    const overflowElementRef = useRef<HTMLDivElement>(null);
    const widthIndicatorElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overflowElement = overflowElementRef.current!;
        const widthIndicatorElement = widthIndicatorElementRef.current!;

        const observer = new ResizeObserver(entries => {
            const { contentRect: { width } } = entries[0]!;
            overflowElement.style.width = width + "px";
        });

        observer.observe(widthIndicatorElement);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={classes.get("wrapper")}>
            <div ref={overflowElementRef} className={classes.get("overflow")}/>
            <div className={classes.build().add("container").addRaw(className).class}>
                <div ref={widthIndicatorElementRef} className={classes.get("widthIndicator")}>
                    {children}
                </div>
            </div>
        </div>
    );
};
