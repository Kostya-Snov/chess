"use client";

import { initialChessState } from "@/chess/ChessState";
import { type Move } from "@/chess/Move";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC, useState } from "react";
import uncheckedClasses from "../Chess.module.scss";
import { Board, type Selection } from "./Board";
import { DeletedPieces } from "./DeletedPieces";
import { History } from "./History";
import { PromotionModal } from "./PromotionModal";


const classes = new CSSModuleClasses(uncheckedClasses);


export const Chess: FC = () => {
    const [history, setHistory] = useState<readonly Move[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [selection, setSelection] = useState<Selection | null>(null);

    const chessState = historyIndex === -1 ? initialChessState : history[historyIndex]!.state;

    return (
        <section className={classes.get("chess")}>
            <div className={classes.get("boardAndDeletedPieces")}>
                <Board
                    chessState={chessState}
                    selection={selection}
                    setSelection={setSelection}
                    onMove={move => {
                        const newHistory = history.slice(0, historyIndex + 1);
                        newHistory.push(move);
                        setHistory(newHistory);
                        setHistoryIndex(historyIndex + 1);
                    }}
                />

                <DeletedPieces pieces={chessState.deletedPieces}/>
            </div>

            <History
                history={history}
                historyIndex={historyIndex}
                onItemClick={index => {
                    setHistoryIndex(index);
                    setSelection(null);
                }}
            />

            <PromotionModal
                isBlack={chessState.isBlacksTurn}
                isOpen={chessState.promotionIndex !== null}
                onPieceClick={type => {
                    const newHistory = history.slice(0, -1);
                    newHistory.push({
                        ...history.at(-1)!,
                        state: chessState.replaceInPromotion(type)
                    });
                    setHistory(newHistory);
                }}
            />
        </section>
    );
};
