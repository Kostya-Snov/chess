"use client";

import { type BoardIndex } from "@/chess/BoardIndex";
import { initialChessState } from "@/chess/ChessState";
import { type Move } from "@/chess/Move";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC, useState } from "react";
import uncheckedClasses from "../Chess.module.scss";
import { Board } from "./Board";
import { DeletedPieces } from "./DeletedPieces";
import { History } from "./History";
import { Panel } from "./Panel";
import { PromotionModal } from "./PromotionModal";


const classes = new CSSModuleClasses(uncheckedClasses);


export const Chess: FC = () => {
    const [history, setHistory] = useState<readonly Move[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState<BoardIndex | -1>(-1);

    const chessState = historyIndex === -1 ? initialChessState : history[historyIndex]!.state;

    return (
        <div className={classes.get("chess")}>
            <div className={classes.get("boardAndDeletedPieces")}>
                <Panel className={classes.get("boardPanel")}>
                    <Board
                        chessState={chessState}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        onMove={move => {
                            const newHistory = history.slice(0, historyIndex + 1);
                            newHistory.push(move);
                            setHistory(newHistory);
                            setHistoryIndex(historyIndex + 1);
                        }}
                    />
                </Panel>

                <Panel>
                    <DeletedPieces pieces={chessState.deletedPieces}/>
                </Panel>
            </div>

            <Panel>
                <History
                    history={history}
                    historyIndex={historyIndex}
                    onItemClick={index => {
                        setHistoryIndex(index);
                        setSelectedIndex(-1);
                    }}
                />
            </Panel>

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
        </div>
    );
}
