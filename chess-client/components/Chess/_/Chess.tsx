"use client";

import { type Move, type PromotionPieceType } from "chess-engine";
import { CSSModuleClasses } from "chess-utils";
import { type Dispatch, type FC, type SetStateAction, useCallback } from "react";
import uncheckedClasses from "../Chess.module.scss";
import { Board } from "./Board";
import { type ChessComponentState } from "./ChessComponentState";
import { DeletedPieces } from "./DeletedPieces";
import { History } from "./History";
import { type PieceSelection } from "./PieceSelection";


const classes = new CSSModuleClasses(uncheckedClasses);


export type ChessProps = {
    readonly state: ChessComponentState;
    readonly setState: Dispatch<SetStateAction<ChessComponentState>>;
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
    const setSelection = useCallback((value: PieceSelection | null): void => {
        setState(prev => prev.setSelection(value));
    }, [setState]);

    return (
        <section className={classes.get("chess")}>
            <div className={classes.get("boardAndDeletedPieces")}>
                <Board
                    chessState={state.chessState}
                    isBlocked={boardIsBlocked}
                    selection={state.selection}
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

                <DeletedPieces pieces={state.chessState.deletedPieces}/>
            </div>

            <History
                history={state.history}
                historyIndex={state.historyIndex}
                onItemClick={index => setState(state.setHistoryIndex(index))}
            />
        </section>
    );
};
