import type { BoardCoordinate } from "@/chess/BoardCoordinate";
import { type Piece, PieceType } from "@/chess/Piece";
import Image from "next/image";
import { type FC } from "react";
import classes from "../PieceComponent.module.scss";
import blackBishopImage from "./images/blackBishop.png";
import blackKingImage from "./images/blackKing.png";
import blackKnightImage from "./images/blackKnight.png";
import blackPawnImage from "./images/blackPawn.png";
import blackQueenImage from "./images/blackQueen.png";
import blackRookImage from "./images/blackRook.png";
import whiteBishopImage from "./images/whiteBishop.png";
import whiteKingImage from "./images/whiteKing.png";
import whiteKnightImage from "./images/whiteKnight.png";
import whitePawnImage from "./images/whitePawn.png";
import whiteQueenImage from "./images/whiteQueen.png";
import whiteRookImage from "./images/whiteRook.png";


const pieceImages = {
    whitePawnImage,
    whiteRookImage,
    whiteKnightImage,
    whiteBishopImage,
    whiteKingImage,
    whiteQueenImage,
    blackPawnImage,
    blackRookImage,
    blackKnightImage,
    blackBishopImage,
    blackKingImage,
    blackQueenImage
} as const;

const pieceTypeNames = {
    [PieceType.Pawn]: "Pawn",
    [PieceType.Rook]: "Rook",
    [PieceType.Knight]: "Knight",
    [PieceType.Bishop]: "Bishop",
    [PieceType.King]: "King",
    [PieceType.Queen]: "Queen",
} as const;


type Props = {
    readonly piece: Piece;
    readonly isSelected: boolean;
    readonly x: BoardCoordinate;
    readonly y: BoardCoordinate;
    readonly onClick: (() => void) | undefined;
};

export const PieceComponent: FC<Props> = ({ piece, isSelected, x, y, onClick }) => {
    const pieceName = `${piece.isBlack ? "black" : "white"}${pieceTypeNames[piece.type]}` as const;
    return (
        <Image
            className={
                classes["piece"]
                + (isSelected ? " " + classes["selected"] : "")
                + " " + classes["piece" + x + "_" + y]
            }
            src={pieceImages[`${pieceName}Image`]}
            alt={pieceName}
            onClick={onClick}
        />
    );
}
