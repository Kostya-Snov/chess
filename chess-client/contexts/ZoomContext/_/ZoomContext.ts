import { createContext } from "react";


export type ZoomContextValue = [
    zoom: number,
    setZoom: (valueOrReduce: number | ((prev: number) => number)) => void
];

export const ZoomContext = createContext<ZoomContextValue | null>(null);
