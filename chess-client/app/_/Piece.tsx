import { type FC } from "react";
import Image from "next/image";
import { type BoardCoordinate } from "@/chess/BoardCoordinate";
import { PieceType } from "@/chess/PieceInfo";
import whitePawnImage from "./images/whitePawn.png";
import whiteRookImage from "./images/whiteRook.png";
import whiteKnightImage from "./images/whiteKnight.png";
import whiteBishopImage from "./images/whiteBishop.png";
import whiteKingImage from "./images/whiteKing.png";
import whiteQueenImage from "./images/whiteQueen.png";
import blackPawnImage from "./images/blackPawn.png";
import blackRookImage from "./images/blackRook.png";
import blackKnightImage from "./images/blackKnight.png";
import blackBishopImage from "./images/blackBishop.png";
import blackKingImage from "./images/blackKing.png";
import blackQueenImage from "./images/blackQueen.png";
import classes from "./Piece.module.scss";


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

const getPieceName = (type: PieceType, isBlack: boolean) =>
    `${isBlack ? "black" : "white"}${pieceTypeNames[type]}` as const;


type Props = {
    readonly type: PieceType;
    readonly isBlack: boolean;
    readonly x: BoardCoordinate;
    readonly y: BoardCoordinate;
    readonly isActive: boolean;
    readonly onClick: (() => void) | undefined;
};

export const Piece: FC<Props> = ({ isActive, x, y, type, isBlack, onClick }) => (
    <Image
        className={
            classes["piece"]
            + (isActive ? " " + classes["active"] : "")
            + " " + classes["piece" + x + "_" + y]
        }
        src={pieceImages[`${getPieceName(type, isBlack)}Image`]}
        alt={getPieceName(type, isBlack)}
        onClick={onClick}
    />
);
