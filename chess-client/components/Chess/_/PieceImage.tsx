import { PieceType } from "@/chess/Piece";
import Image, { type ImageProps } from "next/image";
import { type FC } from "react";
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


export type PieceImageProps = Readonly<Omit<ImageProps, "src" | "alt">> & {
    readonly type: PieceType;
    readonly isBlack: boolean;
};

export const PieceImage: FC<PieceImageProps> = ({ type, isBlack, ...props }) => {
    const pieceName = `${isBlack ? "black" : "white"}${pieceTypeNames[type]}` as const;
    return (
        <Image
            {...props}
            src={pieceImages[`${pieceName}Image`]}
            alt={pieceName}
        />
    );
}
