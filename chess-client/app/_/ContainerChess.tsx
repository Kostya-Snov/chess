"use client";

import { Chess } from "@/components/Chess";
import { CSSModuleClasses } from "chess-utils";
import { type FC, useEffect, useRef } from "react";
import uncheckedClasses from "./ContainerChess.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export const ContainerChess: FC = () => {
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
        <div className={classes.get("chess")}>
            <div ref={overflowElementRef} className={classes.get("overflow")}/>
            <div className={classes.get("frame")}>
                <div ref={widthIndicatorElementRef} className={classes.get("widthIndicator")}>
                    <Chess/>
                </div>
            </div>
        </div>
    );
};
