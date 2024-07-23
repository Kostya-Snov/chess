import type { BoardIndex } from "../BoardIndex";
import type { ChessState } from "../ChessState";
import { Piece, PieceType } from "./Piece";
import { Pawn } from "./Pawn";
import { Rook } from "./Rook";
import { Knight } from "./Knight";
import { Bishop } from "./Bishop";
import { King } from "./King";
import { Queen } from "./Queen";


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
    isBlack: boolean,
    index: BoardIndex,
    state: ChessState
): Piece => new constructors[type](isBlack, index, state);
