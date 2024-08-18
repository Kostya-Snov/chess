"use client";

import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { validateNumberArgument } from "@/utils/validateNumberArgument";
import { type FC, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ZoomContext, type ZoomContextValue } from "./ZoomContext";
import uncheckedClasses from "./ZoomProvider.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


export type ZoomProviderProps = {
    readonly initialZoom?: number;
    readonly threshold?: number;
    readonly children?: ReactNode;
};

export const ZoomProvider: FC<ZoomProviderProps> = ({
    initialZoom = 1,
    threshold = 1e-7,
    children
}) => {
    validateNumberArgument(initialZoom, "initialZoom")
        .isPositive();
    validateNumberArgument(threshold, "threshold")
        .isNonNegative();

    const indicatorElementRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(initialZoom);
    const zoomContextValue = useMemo<ZoomContextValue>(() => [zoom, setZoom], [zoom]);

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
        }

        let needIgnoreResize = false;

        let sizes = getSizes();
        const handleResize = () => {
            const previousSizes = sizes;
            sizes = getSizes();

            if (needIgnoreResize) {
                needIgnoreResize = false;
                return;
            }

            if (!(
                previousSizes.outerWidth === sizes.outerWidth
                && previousSizes.outerHeight === sizes.outerHeight
            )) { // Event fired on browser window change.
                return;
            }

            const widthRatio = previousSizes.rectWidth / sizes.rectWidth;
            const heightRatio = previousSizes.rectHeight / sizes.rectHeight;
            if (Math.abs(widthRatio - heightRatio) < threshold) {
                setZoom(prev => prev * (widthRatio + heightRatio) / 2);
            }
        }

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.ctrlKey && event.key === "0") {
                setZoom(1);
                needIgnoreResize = true;
            }
        }

        addEventListener("resize", handleResize);
        addEventListener("keydown", handleKeyDown);
        return () => {
            removeEventListener("resize", handleResize);
            removeEventListener("keydown", handleKeyDown);
        }
    }, [threshold]);

    return (
        <ZoomContext.Provider value={zoomContextValue}>
            <div ref={indicatorElementRef} className={classes.get("indicator")}/>
            <div style={{ ["--zoom" as string]: zoom }}>
                {children}
            </div>
        </ZoomContext.Provider>
    );
}
