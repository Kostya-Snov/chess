import type { MoveType } from "./Move";
import type { BoardIndex } from "./BoardIndex";


export const enum HistoryItemType {
    Move
}

export type MoveHistoryItem = {
    readonly type: HistoryItemType.Move;
    readonly moveType: MoveType;
    readonly from: BoardIndex;
    readonly to: BoardIndex;
};

export type HistoryItem =
    | MoveHistoryItem;
