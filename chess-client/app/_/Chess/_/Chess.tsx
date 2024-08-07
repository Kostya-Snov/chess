"use client";

import { initialChessState } from "@/chess/ChessState";
import { type Move } from "@/chess/Move";
import { type FC, Fragment, type JSX, useState } from "react";
import classes from "../Chess.module.scss";
import { Board, type Selection } from "./Board";
import { getMoveName } from "./getMoveName";
import { PieceImage } from "./PieceImage";
import { PromotionModal } from "./PromotionModal";
import { bottomSignatures, leftSignatures, rightSignatures, topSignatures } from "./signatures";


const enum Constants {
    InitialHistoryIndex = -1
}

export const Chess: FC = () => {
    const [history, setHistory] = useState<readonly Move[]>([]);
    const [historyIndex, setHistoryIndex] = useState(Constants.InitialHistoryIndex);
    const [selection, setSelection] = useState<Selection | null>(null);

    const chessState = historyIndex === Constants.InitialHistoryIndex
        ? initialChessState
        : history[historyIndex]!.state;

    const pushMove = (move: Move): void => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(move);
        setHistory(newHistory);
        setHistoryIndex(historyIndex + 1);
    }

    const renderHistoryItem = (className: string, index: number, text: string): JSX.Element => {
        const isSelected = historyIndex === index;
        return (
            <button
                className={
                    classes["historyItem"]
                    + (isSelected ? " " + classes["selectedHistoryItem"] : "")
                    + " " + className
                }
                onClick={
                    isSelected
                        ? undefined
                        : () => {
                            setHistoryIndex(index);
                            setSelection(null);
                        }
                }
            >
                {text}
            </button>
        );
    };


    return (
        <div className={classes["chess"]}>
            <div className={classes["history"]}>
                {renderHistoryItem(
                    classes["startHistoryItem"]!,
                    Constants.InitialHistoryIndex,
                    "Початок"
                )}
                {history.map((move, index) => (
                    <Fragment key={index}>
                        {
                            index % 2 === 0
                                ? <span>{Math.floor(index / 2) + 1}.</span>
                                : null
                        }
                        {renderHistoryItem(
                            classes[index % 2 === 0 ? "whiteHistoryItem" : "blackHistoryItem"]!,
                            index,
                            getMoveName(move)
                        )}
                    </Fragment>
                ))}
            </div>
            <div className={classes["boardWithSignatures"]}>
                {rightSignatures}
                {topSignatures}
                {leftSignatures}
                {bottomSignatures}
                <Board
                    chessState={chessState}
                    selection={selection}
                    onMove={pushMove}
                    onChangeSelection={setSelection}
                />
            </div>
            <div className={classes["stateAndDeletedPieces"]}>
                <h2>
                    Хід {chessState.isBlacksTurn ? "чорних" : "білих"}.
                    <span className={classes["dangerousState"]}>
                         {
                             chessState.canMove()
                                 ? chessState.isShah()
                                     ? " Шах!"
                                     : ""
                                 : chessState.isShah()
                                     ? " Мат!"
                                     : " Пат!"
                         }
                    </span>
                </h2>
                <div className={classes["deletedPieces"]}>
                    {chessState.deletedPieces.map(piece => (
                        <PieceImage
                            key={piece.id}
                            className={classes["deletedPiece"]}
                            type={piece.type}
                            isBlack={piece.isBlack}
                        />
                    ))}
                </div>
            </div>
            <PromotionModal
                piecesIsBlack={chessState.isBlacksTurn}
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
};
