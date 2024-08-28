import { type BoardIndex } from "../BoardIndex";
import { type ChessState } from "../ChessState";
import { type MoveType } from "./MoveHandler";


export type Move = {
    readonly type: MoveType;
    readonly from: BoardIndex;
    readonly to: BoardIndex;
    readonly previousState: ChessState;
    readonly state: ChessState;
};
