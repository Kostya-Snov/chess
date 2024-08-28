"use client";

import { useCookieState } from "@/hooks/useCookieState";
import { CSSModuleClasses, validateNumberArgument } from "chess-utils";
import { type FC, type ReactNode, useEffect, useMemo, useRef } from "react";
import { ZoomContext, type ZoomContextValue } from "./ZoomContext";
import uncheckedClasses from "./ZoomProvider.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type ZoomProviderProps = {
    readonly initialZoom: number;
    readonly threshold?: number;
    readonly cookieName?: string;
    readonly children?: ReactNode;
};

export const ZoomProvider: FC<ZoomProviderProps> = ({
    initialZoom,
    threshold = 1e-7,
    cookieName = "zoom",
    children
}) => {
    validateNumberArgument(initialZoom, "initialZoom")
        .isPositive();
    validateNumberArgument(threshold, "threshold")
        .isNonNegative();


    const thresholdRef = useRef(threshold);
    const indicatorElementRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useCookieState(initialZoom, cookieName);
    const zoomContextValue = useMemo<ZoomContextValue>(() => [zoom, setZoom], [zoom, setZoom]);


    useEffect(() => {
        thresholdRef.current = threshold;
    }, [threshold]);


    useEffect(() => {
        const indicatorElement = indicatorElementRef.current!;

        const getSizes = () => {
            const rect = indicatorElement.getBoundingClientRect();
            return {
                rectWidth: rect.width,
                rectHeight: rect.height,
                outerWidth,
                outerHeight
            } as const;
        };

        let sizes = getSizes();
        const handle = () => {
            const previousSizes = sizes;
            sizes = getSizes();

            if (!(
                previousSizes.outerWidth === sizes.outerWidth
                && previousSizes.outerHeight === sizes.outerHeight
            )) { // Event fired on browser window change.
                return;
            }

            const widthRatio = previousSizes.rectWidth / sizes.rectWidth;
            const heightRatio = previousSizes.rectHeight / sizes.rectHeight;
            if (Math.abs(widthRatio - heightRatio) < thresholdRef.current) {
                setZoom(prev => prev * (widthRatio + heightRatio) / 2);
            }
        };

        addEventListener("resize", handle);
        return () => removeEventListener("resize", handle);
    }, [setZoom]);


    return (
        <ZoomContext.Provider value={zoomContextValue}>
            <div ref={indicatorElementRef} className={classes.get("indicator")}/>
            <div style={{ ["--zoom" as string]: zoom }}>
                {children}
            </div>
        </ZoomContext.Provider>
    );
};
