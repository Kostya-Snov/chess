import { type PieceType } from "./pieces";

export type PromotionPieceType =
    | PieceType.Rook
    | PieceType.Knight
    | PieceType.Bishop
    | PieceType.Queen;
