import { type BoardCoordinate } from "@/chess/BoardCoordinate";
import { type Piece } from "@/chess/Piece";
import { type FC } from "react";
import classes from "../PieceOnBoard.module.scss";
import { PieceImage } from "./PieceImage";


type Props = {
    readonly piece: Piece;
    readonly isSelected: boolean;
    readonly x: BoardCoordinate;
    readonly y: BoardCoordinate;
    readonly onClick: (() => void) | undefined;
};

export const PieceOnBoard: FC<Props> = ({ piece, isSelected, x, y, onClick }) => (
    <PieceImage
        className={
            classes["piece"]
            + " " + classes["piece" + x + "_" + y]
            + (isSelected ? " " + classes["selected"] : "")
        }
        type={piece.type}
        isBlack={piece.isBlack}
        onClick={onClick}
    />
);
