export const enum PieceType {
    Pawn,
    Rook,
    Knight,
    Bishop,
    King,
    Queen
}

export type PieceInfo = {
    readonly type: PieceType;
    readonly isBlack: boolean;
    readonly id: number;
};
