import { getX, getY } from "@/chess/BoardCoordinate";
import { type BoardIndex, isBoardIndex } from "@/chess/BoardIndex";
import { ChessConstants } from "@/chess/ChessConstants";
import { type ChessState } from "@/chess/ChessState";
import { type Move } from "@/chess/Move";
import { PieceType } from "@/chess/Piece";
import { assert } from "@/utils/assert";
import { createArray } from "@/utils/createArray";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import Image from "next/image";
import { type FC, useEffect, useState } from "react";
import uncheckedClasses from "../Board.module.scss";
import { Cell } from "./Cell";
import { CoordinateNames } from "./CoordinateNames";
import flipImage from "./images/flip.svg";
import { PieceImage } from "./PieceImage";


const classes = new CSSModuleClasses(uncheckedClasses);


type TransformIndex = (index: BoardIndex) => BoardIndex;

const directTransformIndex: TransformIndex = index => index;

const flippedTransformIndex: TransformIndex = index => {
    const transformedIndex = ChessConstants.BoardLength - 1 - index;
    assert(isBoardIndex(transformedIndex));
    return transformedIndex;
}


export type BoardProps = {
    readonly chessState: ChessState;
    readonly selectedIndex: BoardIndex | -1;
    readonly setSelectedIndex: (index: BoardIndex | -1) => void;
    readonly onMove: (move: Move) => void;
};

export const Board: FC<BoardProps> = ({ chessState, selectedIndex, setSelectedIndex, onMove }) => {
    const [isFlipped, setIsFlipped] = useState(true);


    const { board } = chessState;
    const transformIndex = isFlipped ? flippedTransformIndex : directTransformIndex;
    const moves = selectedIndex === -1 ? null : chessState.getMoves(selectedIndex);


    useEffect(() => {
        const handle = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setSelectedIndex(-1);
            }
        }

        addEventListener("keyup", handle);
        return () => removeEventListener("keyup", handle);
    }, [setSelectedIndex]);


    return (
        <div className={classes.get("board")}>
            <div className={classes.get("boardCore")}>
                {createArray(ChessConstants.BoardLength, viewIndex => {
                    assert(isBoardIndex(viewIndex));
                    const index = transformIndex(viewIndex);
                    const move = moves?.get(index);

                    return (
                        <Cell
                            key={viewIndex}
                            isBlack={(getX(viewIndex) + getY(viewIndex)) % 2 === 1}
                            moveType={move?.type}
                            onClick={
                                move === undefined
                                    ? undefined
                                    : () => {
                                        onMove(move);
                                        setSelectedIndex(-1);
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
                        const viewIndex = transformIndex(index);
                        const inCurrentTurn = chessState.inCurrentTurn(piece);
                        const isSelected = selectedIndex === index;
                        const isKing = piece.type === PieceType.King;

                        const kingStateClassId =
                            inCurrentTurn && isKing
                                ? chessState.canMove()
                                    ? chessState.isShah() ? "shah" : undefined
                                    : chessState.isShah() ? "mate" : "stalemate"
                                : undefined;

                        return (
                            <PieceImage
                                key={piece.id}
                                className={
                                    classes.build()
                                        .add("piece")
                                        .add("piece" + getX(viewIndex) + "_" + getY(viewIndex))
                                        .addIf(inCurrentTurn, "inCurrentTurn")
                                        .addIf(isSelected, "selected")
                                        .addIf(isKing, "king")
                                        .add(kingStateClassId)
                                        .class
                                }
                                type={piece.type}
                                isBlack={piece.isBlack}

                                onClick={
                                    inCurrentTurn
                                        ? () => setSelectedIndex(isSelected ? -1 : index)
                                        : undefined
                                }
                            />
                        );
                    })}
            </div>

            <CoordinateNames isFlipped={isFlipped}/>

            <button className={classes.get("flipButton")} onClick={() => setIsFlipped(!isFlipped)}>
                <Image className={classes.get("flipImage")} src={flipImage} alt="flip"/>
            </button>
        </div>
    );
};
