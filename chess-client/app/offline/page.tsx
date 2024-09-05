import { type Metadata } from "next";
import { type FC } from "react";
import { OfflineChess } from "./_/OfflineChess";


export const metadata: Metadata = {
    title: "Chess offline"
};


const OfflinePage: FC = () => <OfflineChess/>;


export default OfflinePage;
