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
import { type FC, type PointerEventHandler, useEffect, useRef, useState } from "react";
import uncheckedClasses from "../Board.module.scss";
import uncheckedCellClasses from "../Cell.module.scss";
import { Cell } from "./Cell";
import { CoordinateNames } from "./CoordinateNames";
import flipImage from "./images/flip.svg";
import { PieceImage } from "./PieceImage";


const classes = new CSSModuleClasses(uncheckedClasses);
const cellClasses = new CSSModuleClasses(uncheckedCellClasses);


type TransformIndex = (index: BoardIndex) => BoardIndex;

const directTransformIndex: TransformIndex = index => index;

const flippedTransformIndex: TransformIndex = index => {
    const transformedIndex = ChessConstants.BoardLength - 1 - index;
    assert(isBoardIndex(transformedIndex));
    return transformedIndex;
}


const getSignCellElementUnderPiece = (
    x: number,
    y: number,
    pieceElement: Element
): HTMLElement | undefined => {
    const elements = document.elementsFromPoint(x, y);
    const signCellElement = elements[elements[0] === pieceElement ? 1 : 0];

    if (
        signCellElement !== undefined
        && signCellElement.classList.contains(cellClasses.get("baseSign"))
        && signCellElement.parentElement === pieceElement.parentElement
    ) {
        assert(signCellElement instanceof HTMLElement);
        return signCellElement;
    }

    return undefined;
}


export type Selection = {
    readonly index: BoardIndex;
    readonly isReadyForDeselection: boolean;
    readonly draggingProportionShift: readonly [x: number, y: number] | null;
}

export type BoardProps = {
    readonly chessState: ChessState;
    readonly selection: Selection | null;
    readonly setSelection: (value: Selection | null) => void;
    readonly onMove: (move: Move) => void;
};

export const Board: FC<BoardProps> = ({ chessState, selection, setSelection, onMove }) => {
    const draggingElementRef = useRef<HTMLImageElement>();
    const [isFlipped, setIsFlipped] = useState(true);


    const { board } = chessState;
    const moves = selection === null ? null : chessState.getMoves(selection.index);
    const draggingProportionShift = selection === null ? null : selection.draggingProportionShift;
    const inDragging = draggingProportionShift !== null;
    const transformIndex = isFlipped ? flippedTransformIndex : directTransformIndex;


    useEffect(() => {
        const handle = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setSelection(null);
            }
        }

        addEventListener("keyup", handle);
        return () => removeEventListener("keyup", handle);
    }, [setSelection]);


    useEffect(() => {
        if (draggingProportionShift === null) {
            return;
        }
        const [proportionShiftX, proportionShiftY] = draggingProportionShift;

        const pieceElement = draggingElementRef.current;
        assert(pieceElement !== undefined);
        const boardCoreElement = pieceElement.parentElement!;

        let hoveredSignCellElement: Element | null = null;
        const clearHoveredSignCell = (): void =>
            hoveredSignCellElement?.classList.remove(cellClasses.get("hover"));

        const handle = (event: PointerEvent): void => {
            const signCellElement = getSignCellElementUnderPiece(
                event.clientX,
                event.clientY,
                pieceElement
            );
            if (signCellElement === undefined) {
                clearHoveredSignCell();
                hoveredSignCellElement = null;
            } else if (signCellElement !== hoveredSignCellElement) {
                clearHoveredSignCell();
                signCellElement.classList.add(cellClasses.get("hover"));
                hoveredSignCellElement = signCellElement;
            }

            /*
            The vector of the piece RELATIVELY TO VIEWPORT can be written as follows:
            R_ = o_ + r_
            where:
            o_ is the board vector RELATIVELY TO VIEWPORT.
            r_ is the piece vector RELATIVELY TO THE BOARD.

            Hence:
            r_ = R_ - o_

            With (1):
            R_ = p_ - s_
            r_ = p_ - s_ - o_ = p_ - o_ - (ps_x * w, ps_y * h)

            Or in coordinate form:
            r_x = p_x - o_x - ps_x * w
            r_y = p_y - o_y - ps_y * h
            */
            const pieceRect = pieceElement.getBoundingClientRect();
            const boardCoreRect = boardCoreElement.getBoundingClientRect();
            const x = event.clientX - boardCoreRect.x - proportionShiftX * pieceRect.width;
            const y = event.clientY - boardCoreRect.y - proportionShiftY * pieceRect.height;
            pieceElement.style.translate = `${x}px ${y}px`;
        }

        pieceElement.addEventListener("pointermove", handle);
        return () => {
            clearHoveredSignCell();
            pieceElement.style.translate = "";
            pieceElement.removeEventListener("pointermove", handle);
        }
    }, [draggingProportionShift]);


    const getPiecePointerDownHandler = (
        index: BoardIndex
    ): PointerEventHandler<HTMLImageElement> | undefined => {
        if (inDragging || !chessState.inCurrentTurn(board[index]!)) {
            return undefined;
        }

        return event => {
            /*
            About moving a piece.
            The goal is to find the piece's offset RELATIVELY TO THE BOARD (class "boardCore").
            Between moves, it is necessary to retain the position where the piece was captured.

            Let's write the equation ("х_" is the "х" vector):
            p_ = R_ + s_ (1)
            where:
            p_ is the pointer vector RELATIVELY TO VIEWPORT.
            R_ is the piece vector RELATIVELY TO VIEWPORT.
            s_ is the pointer vector RELATIVELY TO THE PIECE. Let's call this "shift".

            Knowing the initial m0_ and R0_, we find the s0_:
            s0_ = m0_ - R0_

            We could stop there if the piece's size were constant. But it is not, it can change when
            the zoom is reset (not in the browser itself, but in the application using the button).
            Example:
            The piece's size is 50x50. The capture occurred at s_ = (25, 25). Accordingly, at the
            center. Let the size of the piece change to 100x100. The old shift is no longer at the
            center, but at 25% from the upper left corner.
            Therefore, we will save not the shift value itself, but the shift relative to the sizes,
            which should be constant:
            ps_x = s_x / w
            ps_y = s_y / h

            ps_x = s0_x / w0 = (m0_x - R0_x) / w0
            ps_y = s0_y / h0 = (m0_y - R0_y) / h0

            s_x = ps_x * w
            s_y = ps_y * h
            s_ = (s_x, s_y) = (ps_x * w, ps_y * h)
            */
            const pieceElement = draggingElementRef.current = event.currentTarget;
            pieceElement.setPointerCapture(event.pointerId);

            const pieceStartRect = pieceElement.getBoundingClientRect();
            setSelection({
                index,
                isReadyForDeselection:
                    selection?.index === index
                    && selection.isReadyForDeselection,
                draggingProportionShift: [
                    (event.clientX - pieceStartRect.x) / pieceStartRect.width,
                    (event.clientY - pieceStartRect.y) / pieceStartRect.height
                ]
            });
        }
    }


    const getPiecePointerUpHandler = (): PointerEventHandler<HTMLImageElement> | undefined => {
        if (selection === null || selection.draggingProportionShift === null) {
            return undefined;
        }

        return event => {
            const pieceElement = event.currentTarget;
            const signCellElement = getSignCellElementUnderPiece(
                event.clientX,
                event.clientY,
                pieceElement
            );
            if (signCellElement !== undefined) {
                signCellElement.click();
            } else {
                setSelection(selection.isReadyForDeselection ? null : {
                    ...selection,
                    isReadyForDeselection: true,
                    draggingProportionShift: null
                })
            }
        }
    }


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
                                        setSelection(null);
                                    }
                            }
                            onDragStart={e => e.preventDefault()}
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
                        const isSelected = selection?.index === index;
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
                                        .addIf(isSelected && inDragging, "inDragging")
                                        .addIf(isKing, "king")
                                        .add(kingStateClassId)
                                        .class
                                }
                                type={piece.type}
                                isBlack={piece.isBlack}

                                onPointerDown={getPiecePointerDownHandler(index)}
                                onPointerUp={getPiecePointerUpHandler()}
                                onDragStart={e => e.preventDefault()}
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
