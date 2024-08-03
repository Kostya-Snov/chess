import type { Metadata } from "next";
import type { FC, ReactNode } from "react";
import "@/styles/cssVariables.scss";
import "./_/layout.scss";


export const metadata: Metadata = {
    title: "Chess"
};


type Props = {
    readonly children?: ReactNode;
};

const RootLayout: FC<Props> = ({ children }) => (
    <html lang="uk">
    <body>{children}</body>
    </html>
);


export default RootLayout;
