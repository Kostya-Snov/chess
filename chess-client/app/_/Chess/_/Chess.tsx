"use client";

import { initialChessState } from "@/chess/ChessState";
import { type FC, useState } from "react";
import classes from "../Chess.module.scss";
import { Board } from "./Board";
import { PieceImage } from "./PieceImage";
import { PromotionModal } from "./PromotionModal";
import { bottomSignatures, leftSignatures, rightSignatures, topSignatures } from "./signatures";


export const Chess: FC = () => {
    const [chessState, setChessState] = useState(initialChessState);

    return (
        <div className={classes["chess"]}>
            <div className={classes["boardWithSignatures"]}>
                {rightSignatures}
                {topSignatures}
                {leftSignatures}
                {bottomSignatures}
                <Board chessState={chessState} onChessStateChange={setChessState}/>
            </div>
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
            <PromotionModal
                piecesIsBlack={chessState.isBlacksTurn}
                isOpen={chessState.promotionIndex !== null}
                onPieceClick={type => setChessState(chessState.replaceInPromotion(type))}
            />
        </div>
    );
};
