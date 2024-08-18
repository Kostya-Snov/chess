import { ZoomProvider } from "@/contexts/ZoomContext";
import { type FC } from "react";
import { ContainerChess } from "./_/ContainerChess";


const RootPage: FC = () => <ZoomProvider><ContainerChess/></ZoomProvider>;


export default RootPage;
