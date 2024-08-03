import { Bishop } from "./Bishop";
import { King } from "./King";
import { Knight } from "./Knight";
import { Pawn } from "./Pawn";
import { type Piece, PieceType } from "./Piece";
import { Queen } from "./Queen";
import { Rook } from "./Rook";


const constructors = {
    [PieceType.Pawn]: Pawn,
    [PieceType.Rook]: Rook,
    [PieceType.Knight]: Knight,
    [PieceType.Bishop]: Bishop,
    [PieceType.King]: King,
    [PieceType.Queen]: Queen
};

export const createPiece = (
    type: PieceType,
    id: number,
    isBlack: boolean,
    isMoved: boolean
): Piece => new constructors[type](id, isBlack, isMoved);
