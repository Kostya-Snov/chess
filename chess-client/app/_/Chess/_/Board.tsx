import type { FC } from "react";
import { assert } from "@/utils/assert";
import { createArray } from "@/utils/createArray";
import { ChessConstants } from "@/chess/ChessConstants";
import { isBoardIndex } from "@/chess/BoardIndex";
import { getX, getY } from "@/chess/BoardCoordinate";
import type { ChessState } from "@/chess/ChessState";
import { Cell } from "./Cell";
import { PieceComponent } from "./PieceComponent";
import classes from "../Board.module.scss";


type Props = {
    readonly state: ChessState;
};

export const Board: FC<Props> = ({ state }) => (
    <div className={classes["board"]}>
        {createArray(ChessConstants.BoardLength, index => {
            assert(isBoardIndex(index));
            const move = state.moves.get(index);
            return (
                <Cell
                    key={index}
                    isBlack={(getX(index) + getY(index)) % 2 === 1}
                    moveType={move?.type}
                    onClick={
                        move === undefined
                            ? undefined
                            : () => state.applyMove(index)
                    }
                />
            );
        })}

        {state.board
            .filter(p => p !== undefined)
            .sort((p1, p2) => p1.id - p2.id)
            .map(piece => (
                <PieceComponent
                    key={piece.id}
                    piece={piece}
                    onClick={
                        piece.isCurrentTurn
                            ? piece.isSelected
                                ? () => state.deselect()
                                : () => piece.select()
                            : undefined
                    }
                />
            ))}
    </div>
);
