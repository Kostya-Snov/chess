"use client";

import { ZoomProvider } from "@/contexts/ZoomContext";
import { useCookieState } from "@/hooks/useCookieState";
import { CSSModuleClasses } from "chess-utils";
import { type FC, type ReactNode } from "react";
import { Header } from "./Header";
import uncheckedClasses from "./RootLayoutClient.module.scss";


const classes = new CSSModuleClasses(uncheckedClasses);


const serializeIsDarkTheme = (isDarkTheme: boolean | undefined) =>
    isDarkTheme === undefined ? null : String(isDarkTheme);


export type RootLayoutClientProps = {
    readonly initialZoom: number;
    readonly initialIsDarkTheme: boolean | undefined;
    readonly children?: ReactNode;
};

export const RootLayoutClient: FC<RootLayoutClientProps> = ({
    initialZoom,
    initialIsDarkTheme,
    children
}) => {
    const [isDarkTheme, setIsDarkTheme] = useCookieState(
        initialIsDarkTheme,
        "isDarkTheme",
        serializeIsDarkTheme
    );

    return (
        <body
            className={
                classes.build()
                    .add("theme")
                    .add(
                        isDarkTheme === undefined
                            ? undefined
                            : isDarkTheme ? "dark" : "light"
                    )
                    .class
            }
        >
        <ZoomProvider initialZoom={initialZoom}>
            <Header isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme}/>
            <main className={classes.get("main")}>
                {children}
            </main>
        </ZoomProvider>
        </body>
    );
};
