import { type Metadata } from "next";
import { type FC } from "react";
import { OnlineChess } from "./_/OnlineChess";


export const metadata: Metadata = {
    title: "Chess online"
};


const OnlinePage: FC = () => <OnlineChess/>;


export default OnlinePage;
