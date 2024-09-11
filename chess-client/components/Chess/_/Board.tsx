import {
    type BoardIndex,
    ChessConstants,
    type ChessState,
    getX,
    getY,
    isBoardIndex,
    type Move,
    PieceType,
    type PromotionPieceType
} from "chess-engine";
import { assert, createArray, CSSModuleClasses } from "chess-utils";
import {
    type FC,
    type MouseEventHandler,
    type PointerEventHandler,
    useEffect,
    useRef,
    useState
} from "react";
import uncheckedClasses from "../Board.module.scss";
import uncheckedCellClasses from "../Cell.module.scss";
import { Cell } from "./Cell";
import { CoordinateNames } from "./CoordinateNames";
import { Panel } from "./Panel";
import { PieceImage } from "./PieceImage";
import { PieceSelection } from "./PieceSelection";
import { PromotionModal } from "./PromotionModal";


const classes = new CSSModuleClasses(uncheckedClasses);
const cellClasses = new CSSModuleClasses(uncheckedCellClasses);


const flipImage = (
    <svg
        className={classes.get("flipImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
    >
        <path
            d="
            M5 6.09v12l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42 1 1 0
            0 0-1.42 0L7 18.09v-12A1.56 1.56 0 0 1 8.53 4.5H11a1 1 0 0 0 0-2H8.53A3.56 3.56 0 0 0 5
            6.09zm9.29-.3a1 1 0 0 0 1.42 1.42L17 5.91v12a1.56 1.56 0 0 1-1.53 1.59H13a1 1 0 0 0 0
            2h2.47A3.56 3.56 0 0 0 19 17.91v-12l1.29 1.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-3-3a1 1
            0 0 0-1.42 0z
            "
        />
    </svg>
);


const centerImage = (
    <svg
        className={classes.get("centerImage")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 53 53"
    >
        <path
            d="
            M36.414 35H46a1 1 0 1 0 0-2H34a.996.996 0 0 0-1 1v12a1 1 0 1 0 2 0v-9.586l16.293
            16.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L36.414 35zM16.585 17.999H6.999a1 1
            0 1 0 0 2h12a.996.996 0 0 0 1-1v-12a1 1 0 1 0-2 0v9.586L1.707.293A.999.999 0 1 0 .293
            1.707l16.292 16.292zm2.797 15.078A1.01 1.01 0 0 0 19 33H7a1 1 0 1 0 0 2h9.586L.293
            51.293a.999.999 0 1 0 1.414 1.414L18 36.414V46a1 1 0 1 0 2 0V34a.996.996 0 0
            0-.618-.923zm14.236-13.154c.122.05.252.077.382.077h12a1 1 0 1 0 0-2h-9.586L52.707
            1.707A.999.999 0 1 0 51.293.293L35 16.586V7a1 1 0 1 0-2 0v12a.996.996 0 0 0 .618.923zM21
            32h11V21H21v11zm2-9h7v7h-7v-7z
            "
        />
    </svg>
);


type TransformIndex = (index: BoardIndex) => BoardIndex;

const directTransformIndex: TransformIndex = index => index;

const flippedTransformIndex: TransformIndex = index => {
    const transformedIndex = ChessConstants.BoardLength - 1 - index;
    assert(isBoardIndex(transformedIndex));
    return transformedIndex;
};


const getSignCellElementUnderPiece = (
    x: number,
    y: number,
    pieceElement: Element
): HTMLElement | undefined => {
    const elements = document.elementsFromPoint(x, y);
    const signCellElement = elements[elements[0] === pieceElement ? 1 : 0];

    if (
        signCellElement !== undefined
        && signCellElement.hasAttribute("data-sign")
        && signCellElement.parentElement === pieceElement.parentElement
    ) {
        assert(signCellElement instanceof HTMLElement);
        return signCellElement;
    }

    return undefined;
};


const handleCenterButtonClick: MouseEventHandler<HTMLButtonElement> = event => {
    let boardElement = event.currentTarget.parentElement!;
    while (!boardElement.classList.contains(classes.get("board"))) {
        boardElement = boardElement.parentElement!;
    }
    boardElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });
};


export type BoardProps = {
    readonly chessState: ChessState;
    readonly isBlocked: boolean;
    readonly selection: PieceSelection | null;
    readonly setSelection: (value: PieceSelection | null) => void;
    readonly onMove: (move: Move) => void;
    readonly onPromotionChoose: (type: PromotionPieceType) => void;
};

export const Board: FC<BoardProps> = ({
    chessState,
    isBlocked,
    selection,
    setSelection,
    onMove,
    onPromotionChoose
}) => {
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
        };

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
        };

        pieceElement.addEventListener("pointermove", handle);
        return () => {
            clearHoveredSignCell();
            pieceElement.style.translate = "";
            pieceElement.removeEventListener("pointermove", handle);
        };
    }, [draggingProportionShift]);


    const getPiecePointerDownHandler = (
        index: BoardIndex
    ): PointerEventHandler<HTMLImageElement> | undefined => {
        if (isBlocked || inDragging || !chessState.inCurrentTurn(board[index]!)) {
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
            setSelection(new PieceSelection(
                index,
                selection?.index === index
                && selection.isReadyForDeselection,
                [
                    (event.clientX - pieceStartRect.x) / pieceStartRect.width,
                    (event.clientY - pieceStartRect.y) / pieceStartRect.height
                ]
            ));
        };
    };


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
                setSelection(selection.isReadyForDeselection ? null : selection.with(true, null));
            }
        };
    };


    return (
        <Panel className={classes.get("board")}>
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
                            data-sign={move === undefined ? undefined : ""}
                            onClick={
                                move === undefined
                                    ? undefined
                                    : () => onMove(move)
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
                                        .addIf(!isBlocked && inCurrentTurn, "interactable")
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

                <PromotionModal
                    isOpen={!isBlocked && chessState.promotionIndex !== null}
                    isBlack={chessState.isBlacksTurn}
                    onChoose={onPromotionChoose}
                />
            </div>

            <CoordinateNames isFlipped={isFlipped}/>

            <button className={classes.get("flipButton")} onClick={() => setIsFlipped(!isFlipped)}>
                {flipImage}
            </button>

            {["top", "bottom"].map(position => (
                <button
                    key={position}
                    className={classes.get(position + "CenterButton")}
                    onClick={handleCenterButtonClick}
                >
                    {centerImage}
                </button>
            ))}
        </Panel>
    );
};
