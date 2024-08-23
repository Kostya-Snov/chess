"use client";

import { useZoom, ZoomProvider } from "@/contexts/ZoomContext";
import { useCookieState } from "@/hooks/useCookieState";
import { buttonClasses, colorsClasses } from "@/styles";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import Image from "next/image";
import { type FC, type ReactNode } from "react";
import darkThemeImage from "./images/darkTheme.svg";
import lightThemeImage from "./images/lightTheme.svg";
import resetZoomImage from "./images/resetZoom.svg";
import uncheckedClasses from "./RootLayoutClient.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const ResetZoomButton: FC = () => {
    const [, setZoom] = useZoom();

    return (
        <button className={classes.get("headerButton")} onClick={() => setZoom(1)}>
            <Image className={buttonClasses.get("image")} src={resetZoomImage} alt="resetZoom"/>
        </button>
    );
};


export type RootLayoutClientProps = {
    readonly initialZoom: number;
    readonly initialIsDarkTheme: boolean;
    readonly children?: ReactNode;
};

export const RootLayoutClient: FC<RootLayoutClientProps> = ({
    initialZoom,
    initialIsDarkTheme,
    children
}) => {
    const [isDarkTheme, setIsDarkTheme] = useCookieState(initialIsDarkTheme, "isDarkTheme");

    return (
        <body className={colorsClasses.get(isDarkTheme ? "dark" : "light")}>
        <ZoomProvider initialZoom={initialZoom}>
            <header className={classes.get("header")}>
                <ResetZoomButton/>
                <button
                    className={classes.get("headerButton")}
                    onClick={() => setIsDarkTheme(!isDarkTheme)}
                >
                    <Image
                        className={buttonClasses.get("image")}
                        src={isDarkTheme ? darkThemeImage : lightThemeImage}
                        alt="changeTheme"
                    />
                </button>
            </header>
            <main className={classes.get("main")}>
                {children}
            </main>
        </ZoomProvider>
        </body>
    );
};
