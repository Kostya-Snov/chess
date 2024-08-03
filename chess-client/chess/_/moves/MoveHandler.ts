import { type BoardIndex } from "../../BoardIndex";
import { type ChessStateDraft } from "../ChessStateDraft";


export const enum MoveType {
    Movement,
    Attack,
    EnPassant,
    Castling
}

export type MoveHandler = {
    readonly type: MoveType;

    apply(from: BoardIndex, to: BoardIndex, draft: ChessStateDraft): void;
};
