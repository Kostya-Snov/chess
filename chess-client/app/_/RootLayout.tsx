import { cookies } from "next/headers";
import { type FC, type ReactNode } from "react";
import { RootLayoutClient } from "./RootLayoutClient";
import "./RootLayout.scss";


export type RootLayoutProps = {
    readonly children?: ReactNode;
};

export const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    let initialZoom = 1;
    const zoomCookie = cookies().get("zoom");
    if (zoomCookie !== undefined) {
        const zoom = Number(zoomCookie.value);
        if (zoom > 0) {
            initialZoom = zoom;
        }
    }

    let initialIsDarkTheme: boolean | undefined = undefined;
    const isDarkThemeCookie = cookies().get("isDarkTheme");
    if (isDarkThemeCookie !== undefined) {
        switch (isDarkThemeCookie.value.toLowerCase()) {
            case "true":
                initialIsDarkTheme = true;
                break;
            case "false":
                initialIsDarkTheme = false;
                break;
        }
    }

    return (
        <html lang="uk">
        <RootLayoutClient initialZoom={initialZoom} initialIsDarkTheme={initialIsDarkTheme}>
            {children}
        </RootLayoutClient>
        </html>
    );
};
