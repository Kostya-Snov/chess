import { getX, getY } from "@/chess/BoardCoordinate";
import { type BoardIndex, isBoardIndex } from "@/chess/BoardIndex";
import { ChessConstants } from "@/chess/ChessConstants";
import { type ChessState } from "@/chess/ChessState";
import { type Move } from "@/chess/Move";
import { assert } from "@/utils/assert";
import { createArray } from "@/utils/createArray";
import { type FC, useEffect, useState } from "react";
import classes from "../Board.module.scss";
import { Cell } from "./Cell";
import { PieceOnBoard } from "./PieceOnBoard";


type Props = {
    readonly chessState: ChessState;
    readonly onChessStateChange: (state: ChessState) => void;
};

export const Board: FC<Props> = ({ chessState, onChessStateChange }) => {
    type Selection = {
        readonly index: BoardIndex;
        readonly moves: Map<BoardIndex, Move>;
    };

    const [selection, setSelection] = useState<Selection | null>(null);

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelection(null);
            }
        }
        addEventListener("keyup", listener);
        return () => removeEventListener("keyup", listener);
    }, []);

    const { board } = chessState;

    return (
        <div className={classes["board"]}>
            {createArray(ChessConstants.BoardLength, index => {
                assert(isBoardIndex(index));
                const move = selection?.moves.get(index);
                return (
                    <Cell
                        key={index}
                        isBlack={(getX(index) + getY(index)) % 2 === 1}
                        moveType={move?.type}
                        onClick={
                            move === undefined
                                ? undefined
                                : () => {
                                    onChessStateChange(move.state);
                                    setSelection(null);
                                }
                        }
                    />
                );
            })}

            {board
                .filter(p => p !== undefined)
                .sort((p1, p2) => p1.id - p2.id)
                .map(piece => {
                    const index = board.indexOf(piece);
                    assert(isBoardIndex(index));
                    const isSelected = selection?.index === index;

                    return (
                        <PieceOnBoard
                            key={piece.id}
                            piece={piece}
                            isSelected={isSelected}
                            x={getX(index)}
                            y={getY(index)}

                            onClick={
                                chessState.inCurrentTurn(piece)
                                    ? () => setSelection(
                                        isSelected
                                            ? null
                                            : {
                                                index,
                                                moves: chessState.getMoves(index)
                                            }
                                    )
                                    : undefined
                            }
                        />
                    );
                })}
        </div>
    );
};
