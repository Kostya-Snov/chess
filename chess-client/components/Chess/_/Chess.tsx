"use client";

import { initialChessState } from "@/chess/ChessState";
import { type Move } from "@/chess/Move";
import { CSSModuleClasses } from "@/utils/CSSModuleClasses";
import { type FC, type MouseEventHandler, useState } from "react";
import uncheckedClasses from "../Chess.module.scss";
import { Board, type Selection } from "./Board";
import { DeletedPieces } from "./DeletedPieces";
import { History } from "./History";
import { Panel } from "./Panel";
import { PromotionModal } from "./PromotionModal";


const classes = new CSSModuleClasses(uncheckedClasses);


const centerBoardPanel: MouseEventHandler<HTMLButtonElement> = event => {
    let boardPanelElement = event.currentTarget.parentElement!;
    while (!boardPanelElement.classList.contains(classes.get("boardPanel"))) {
        boardPanelElement = boardPanelElement.parentElement!;
    }
    boardPanelElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });
}


export const Chess: FC = () => {
    const [history, setHistory] = useState<readonly Move[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [selection, setSelection] = useState<Selection | null>(null);

    const chessState = historyIndex === -1 ? initialChessState : history[historyIndex]!.state;

    return (
        <div className={classes.get("chess")}>
            <div className={classes.get("boardAndDeletedPieces")}>
                <Panel className={classes.get("boardPanel")}>
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
                        onCenterButtonClick={centerBoardPanel}
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
                        setSelection(null);
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
