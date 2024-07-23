"use client";

import { type FC, useEffect, useReducer, useRef } from "react";
import { assert } from "@/utils/assert";
import { createArray } from "@/utils/createArray";
import { ChessConstants } from "@/chess/ChessConstants";
import { isBoardIndex } from "@/chess/BoardIndex";
import { getX, getY } from "@/chess/BoardCoordinate";
import { ChessState } from "@/chess/ChessState";
import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { bottomSignatures, leftSignatures, rightSignatures, topSignatures } from "./signatures";
import classes from "./Chess.module.scss";


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
        <div className={classes["board"]}>
            {rightSignatures}
            {topSignatures}
            {leftSignatures}
            {bottomSignatures}

            {createArray(ChessConstants.BoardLength, index => {
                assert(isBoardIndex(index));
                const move = chessState.moves.get(index);
                return (
                    <Cell
                        key={index}
                        isBlack={(getX(index) + getY(index)) % 2 === 0}
                        moveType={move?.type}
                        onClick={
                            move === undefined
                                ? undefined
                                : () => chessState.applyMove(index)
                        }
                    />
                );
            })}

            {
                chessState.board
                    .filter(p => p !== undefined)
                    .sort((p1, p2) => p1.id - p2.id)
                    .map(piece => (
                        <Piece
                            key={piece.id}
                            type={piece.type}
                            isBlack={piece.isBlack}
                            x={piece.x}
                            y={piece.y}
                            isActive={piece.isSelected}
                            onClick={
                                piece.isCurrentTurn
                                    ? piece.isSelected
                                        ? () => chessState.deselect()
                                        : () => piece.select()
                                    : undefined
                            }
                        />
                    ))
            }
        </div>
    );
}
