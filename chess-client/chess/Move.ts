import type { BoardIndex } from "./BoardIndex";


export const enum MoveType {
    Movement,
    Attack
}

export type Move = {
    readonly type: MoveType;
    readonly from: BoardIndex;
    readonly to: BoardIndex;
};
