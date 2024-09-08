"use client";

import { type Move, type PromotionPieceType } from "chess-engine";
import { CSSModuleClasses } from "chess-utils";
import { type FC, useState } from "react";
import uncheckedClasses from "../Chess.module.scss";
import { type ChessComponentState } from "../ChessComponentState";
import { Board, type Selection } from "./Board";
import { DeletedPieces } from "./DeletedPieces";
import { History } from "./History";


const classes = new CSSModuleClasses(uncheckedClasses);


export type ChessProps = {
    readonly state: ChessComponentState;
    readonly setState: (value: ChessComponentState) => void;
    readonly boardIsBlocked?: boolean;
    readonly onMove?: (move: Move) => void;
    readonly onPromotionChoose?: (type: PromotionPieceType) => void;
};

export const Chess: FC<ChessProps> = ({
    state,
    setState,
    boardIsBlocked = false,
    onMove,
    onPromotionChoose
}) => {
    const [selection, setSelection] = useState<Selection | null>(null);

    const { history, historyIndex, chessState } = state;

    return (
        <section className={classes.get("chess")}>
            <div className={classes.get("boardAndDeletedPieces")}>
                <Board
                    chessState={chessState}
                    isBlocked={boardIsBlocked}
                    selection={selection}
                    setSelection={setSelection}
                    onMove={move => {
                        onMove?.(move);
                        setState(state.applyMove(move));
                    }}
                    onPromotionChoose={type => {
                        onPromotionChoose?.(type);
                        setState(state.replaceInPromotion(type));
                    }}
                />

                <DeletedPieces pieces={chessState.deletedPieces}/>
            </div>

            <History
                history={history}
                historyIndex={historyIndex}
                onItemClick={index => {
                    setState(state.setHistoryIndex(index));
                    setSelection(null);
                }}
            />
        </section>
    );
};
