"use client";

import { type FC, useEffect, useReducer, useState } from "react";
import { assert } from "@/utils/assert";
import { createArray } from "@/utils/createArray";
import { ChessEngine } from "@/chess/ChessEngine";
import { isBoardIndex } from "@/chess/BoardIndex";
import { getX, getY } from "@/chess/BoardCoordinate";
import { ChessConstants } from "@/chess/ChessConstants";
import { Cell } from "./Cell";
import { Piece } from "./Piece";
import { bottomSignatures, leftSignatures, rightSignatures, topSignatures } from "./signatures";
import classes from "./Chess.module.scss";


const useChessEngine = (
    initialize = () => new ChessEngine()
): [ChessEngine, (update: (engine: ChessEngine) => void) => void] => {
    const [engine] = useState(initialize);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    return [
        engine,
        update => {
            update(engine);
            forceUpdate();
        }
    ];
}


export const Chess: FC = () => {
    const [engine, updateEngine] = useChessEngine();

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                updateEngine(e => e.selectedIndex = null);
            }
        }
        addEventListener("keyup", listener);
        return () => removeEventListener("keyup", listener);
    }, [updateEngine]);


    return (
        <div className={classes["board"]}>
            {rightSignatures}
            {topSignatures}
            {leftSignatures}
            {bottomSignatures}

            {createArray(ChessConstants.BoardLength, index => {
                assert(isBoardIndex(index));
                const move = engine.moves === null ? undefined : engine.moves.get(index);
                return (
                    <Cell
                        key={index}
                        isBlack={(getX(index) + getY(index)) % 2 === 0}
                        moveType={move?.type}
                        onClick={
                            move === undefined
                                ? undefined
                                : () => updateEngine(e => e.applyMove(index))
                        }
                    />
                );
            })}

            {
                [...engine.getPieces()]
                    .sort(([, { id: id1 }], [, { id: id2 }]) => id1 - id2)
                    .map(([index, info]) => (
                        <Piece
                            key={info.id}
                            type={info.type}
                            isBlack={info.isBlack}
                            x={getX(index)}
                            y={getY(index)}
                            isActive={engine.selectedIndex === index}
                            onClick={
                                info.isBlack && engine.isBlackTurn
                                || !info.isBlack && !engine.isBlackTurn
                                    ? () => updateEngine(e =>
                                        e.selectedIndex = e.selectedIndex === index ? null : index
                                    )
                                    : undefined
                            }
                        />
                    ))
            }
        </div>
    );
}
