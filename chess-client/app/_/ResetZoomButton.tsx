"use client";

import { useZoom } from "@/contexts/ZoomContext";
import { buttonClasses } from "@/styles";
import Image from "next/image";
import { type FC } from "react";
import resetZoomImage from "./images/resetZoom.svg";


export const ResetZoomButton: FC = () => {
    const [, setZoom] = useZoom();

    return (
        <button className={buttonClasses.build("base", "square")} onClick={() => setZoom(1)}>
            <Image className={buttonClasses.get("image")} src={resetZoomImage} alt="resetZoom"/>
        </button>
    );
}
