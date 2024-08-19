import { ZoomProvider } from "@/contexts/ZoomContext";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { type FC, type ReactNode } from "react";
import "@/styles/cssVariables.scss";
import "./_/layout.scss";
import uncheckedClasses from "./_/layout.module.scss";
import { ResetZoomButton } from "./_/ResetZoomButton";


const classes = new CSSModuleClasses(uncheckedClasses);


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

    return (
        <html lang="uk">
        <body>
        <ZoomProvider initialZoom={initialZoom}>
            <ResetZoomButton/>
            <div className={classes.get("content")}>
                {children}
            </div>
        </ZoomProvider>
        </body>
        </html>
    );
}


export default RootLayout;
