import type { PromotionPieceType } from "@/chess/Piece";
import { PieceType } from "@/chess/Piece";
import type { FC } from "react";
import classes from "../PromotionModal.module.scss";
import { PieceImage } from "./PieceImage";


const promotionPieceTypes: readonly PromotionPieceType[] = [
    PieceType.Rook,
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen
];


type Props = {
    readonly piecesIsBlack: boolean;
    readonly isOpen: boolean;
    readonly onPieceClick: (type: PromotionPieceType) => void;
};

export const PromotionModal: FC<Props> = ({ piecesIsBlack, isOpen, onPieceClick }) => (
    <div
        className={
            classes["container"]
            + (isOpen ? " " + classes["open"] : "")
        }
    >
        <div className={classes["content"]}>
            {promotionPieceTypes.map(type => (
                <PieceImage
                    key={type}
                    className={classes["piece"]}
                    type={type}
                    isBlack={piecesIsBlack}
                    onClick={() => onPieceClick(type)}
                />
            ))}
        </div>
    </div>
);
