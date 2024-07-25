"use client";

import { type FC, useEffect, useReducer, useRef } from "react";
import { ChessState } from "@/chess/ChessState";
import { bottomSignatures, leftSignatures, rightSignatures, topSignatures } from "./signatures";
import { Board } from "./Board";
import classes from "../Chess.module.scss";


const useChessState = (initialize = () => new ChessState()): ChessState => {
    const stateRef = useRef<ChessState>();
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const state = stateRef.current ??= initialize();
    state.addChangeListener(forceUpdate);
    return state;
}

export const Chess: FC = () => {
    const chessState = useChessState();

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                chessState.deselect();
            }
        }
        addEventListener("keyup", listener);
        return () => removeEventListener("keyup", listener);
    }, [chessState]);

    return (
        <div className={classes["boardWithSignatures"]}>
            {rightSignatures}
            {topSignatures}
            {leftSignatures}
            {bottomSignatures}
            <Board state={chessState}/>
        </div>
    );
}
