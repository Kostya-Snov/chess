"use client";

import { Chess, initialChessComponentState } from "@/components/Chess";
import { ChessContainer } from "@/components/ChessContainer";
import { type FC, useState } from "react";


export const OfflineChess: FC = () => {
    const [chessComponentState, setChessComponentState] = useState(initialChessComponentState);

    return (
        <ChessContainer>
            <Chess state={chessComponentState} setState={setChessComponentState}/>
        </ChessContainer>
    );
};
