import { PieceType } from "@/chess/Piece";
import Image, { type ImageProps } from "next/image";
import { type FC } from "react";
import blackBishopImage from "./images/blackBishop.svg";
import blackKingImage from "./images/blackKing.svg";
import blackKnightImage from "./images/blackKnight.svg";
import blackPawnImage from "./images/blackPawn.svg";
import blackQueenImage from "./images/blackQueen.svg";
import blackRookImage from "./images/blackRook.svg";
import whiteBishopImage from "./images/whiteBishop.svg";
import whiteKingImage from "./images/whiteKing.svg";
import whiteKnightImage from "./images/whiteKnight.svg";
import whitePawnImage from "./images/whitePawn.svg";
import whiteQueenImage from "./images/whiteQueen.svg";
import whiteRookImage from "./images/whiteRook.svg";


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
};
