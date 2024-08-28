import { type PieceType } from "./pieces/Piece";

export type PromotionPieceType =
    | PieceType.Rook
    | PieceType.Knight
    | PieceType.Bishop
    | PieceType.Queen;
