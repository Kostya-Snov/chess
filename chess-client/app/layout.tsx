import { type Metadata } from "next";
import { cookies } from "next/headers";
import { type FC, type ReactNode } from "react";
import "./_/layout.scss";
import { RootLayoutClient } from "./_/RootLayoutClient";


export const metadata: Metadata = {
    title: "Chess"
};


type Props = {
    readonly children?: ReactNode;
};

const RootLayout: FC<Props> = ({ children }) => {
    let initialZoom = 1;
    const zoomCookie = cookies().get("zoom");
    if (zoomCookie !== undefined) {
        const zoom = Number(zoomCookie.value);
        if (zoom > 0) {
            initialZoom = zoom;
        }
    }

    const isDarkThemeCookie = cookies().get("isDarkTheme");
    const initialIsDarkTheme =
        isDarkThemeCookie === undefined
        || isDarkThemeCookie.value.toLowerCase() !== "false";

    return (
        <html lang="uk">
        <RootLayoutClient initialZoom={initialZoom} initialIsDarkTheme={initialIsDarkTheme}>
            {children}
        </RootLayoutClient>
        </html>
    );
}


export default RootLayout;
