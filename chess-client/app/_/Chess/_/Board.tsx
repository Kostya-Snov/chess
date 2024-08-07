import { getX, getY } from "@/chess/BoardCoordinate";
import { type BoardIndex, isBoardIndex } from "@/chess/BoardIndex";
import { ChessConstants } from "@/chess/ChessConstants";
import { type ChessState } from "@/chess/ChessState";
import { type Move } from "@/chess/Move";
import { assert } from "@/utils/assert";
import { createArray } from "@/utils/createArray";
import { type FC, useEffect } from "react";
import classes from "../Board.module.scss";
import { Cell } from "./Cell";
import { PieceOnBoard } from "./PieceOnBoard";


export type Selection = {
    readonly index: BoardIndex;
    readonly moves: ReadonlyMap<BoardIndex, Move>;
};

type Props = {
    readonly chessState: ChessState;
    readonly selection: Selection | null;
    readonly isFlipped: boolean;
    readonly onMove: (move: Move) => void;
    readonly onChangeSelection: (selection: Selection | null) => void;
};

export const Board: FC<Props> = ({
    chessState,
    selection,
    isFlipped,
    onMove,
    onChangeSelection
}) => {
    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onChangeSelection(null);
            }
        }
        addEventListener("keyup", listener);
        return () => removeEventListener("keyup", listener);
    }, [onChangeSelection]);

    const { board } = chessState;

    const flipIndex: (index: BoardIndex) => BoardIndex =
        isFlipped
            ? index => {
                const flippedIndex = ChessConstants.BoardLength - 1 - index;
                assert(isBoardIndex(flippedIndex));
                return flippedIndex;
            }
            : index => index;

    return (
        <div className={classes["board"]}>
            {createArray(ChessConstants.BoardLength, flippedIndex => {
                assert(isBoardIndex(flippedIndex));
                const index = flipIndex(flippedIndex);
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
                                    onMove(move);
                                    onChangeSelection(null);
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
                    const flippedIndex = flipIndex(index);

                    return (
                        <PieceOnBoard
                            key={piece.id}
                            piece={piece}
                            isSelected={isSelected}
                            x={getX(flippedIndex)}
                            y={getY(flippedIndex)}

                            onClick={
                                chessState.inCurrentTurn(piece)
                                    ? () => onChangeSelection(
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
