"use client";

import { useZoom, ZoomProvider } from "@/contexts/ZoomContext";
import { useCookieState } from "@/hooks/useCookieState";
import { colorsClasses } from "@/styles";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC, type ReactNode } from "react";
import uncheckedClasses from "./RootLayoutClient.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const resetZoomImage = (
    <svg
        className={classes.get("resetZoomImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 21 21"
    >
        <path
            d="M3.5 8.5a5 5 0 1 0 1.057-3.074M4.5 1.5v4h4m9 12-5.379-5.379"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


const lightThemeImage = (
    <svg
        className={classes.get("lightThemeImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        strokeWidth="3"
    >
        <path
            d="
            M24.78 41.94c0-5.63-3.48-10.34-5.35-13.83a13.38 13.38 0 0 1-1.59-6.33c0-7.4 6.76-13.4
            14.16-13.4m7.22 33.56c0-5.63 3.48-10.34 5.35-13.83a13.38 13.38 0 0 0
            1.59-6.33c0-7.4-6.76-13.4-14.16-13.4m3.78 42.49v.93a3.52 3.52 0 1 1-7
            0v-.93m-5.91-29.73a8.19 8.19 0 0 1 8.59-7.75
            "
        />
        <rect width="20.62" height="4.62" x="21.96" y="41.63" rx="2.31"/>
        <rect width="18.09" height="4.62" x="23.22" y="46.25" rx="2.31"/>
    </svg>
);


const darkThemeImage = (
    <svg
        className={classes.get("darkThemeImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        strokeWidth="3"
    >
        <path
            d="
            m50.4 24.38 7.9-1.24m-10.37-6.03 4.94-2.91m-9.98-2.47 3.32-7.22m-12.76
            6.18-.04-5.73m-9.12 7.13-2.67-7.58m-3.63 12.52-5.03-2.74m2.82 9.68-7.75-1.31m18.19
            22.81c0-5.16-3.19-9.49-4.91-12.69A12.24 12.24 0 0 1 19.85 27c0-6.79 6.21-12.3
            13-12.3m6.63 30.77c0-5.16 3.19-9.49 4.91-12.69A12.24 12.24 0 0 0 45.85
            27c0-6.79-6.21-12.3-13-12.3m3.47 38.98v.84a3.23 3.23 0 1 1-6.44 0v-.84m-5.31-27.43a7.5
            7.5 0 0 1 7.88-7.11
            "
        />
        <rect width="18.93" height="4.25" x="23.63" y="45.19" rx="2.12"/>
        <rect width="16.61" height="4.25" x="24.79" y="49.43" rx="2.12"/>
    </svg>
);


const ResetZoomButton: FC = () => {
    const [, setZoom] = useZoom();

    return (
        <button className={classes.get("headerButton")} onClick={() => setZoom(1)}>
            {resetZoomImage}
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
                    {isDarkTheme ? darkThemeImage : lightThemeImage}
                </button>
            </header>
            <main className={classes.get("main")}>
                {children}
            </main>
        </ZoomProvider>
        </body>
    );
};
