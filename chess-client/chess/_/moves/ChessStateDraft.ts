import type { BoardIndex } from "../../BoardIndex";
import { ChessState } from "../ChessState";
import type { Piece } from "../pieces";


export class ChessStateDraft {
    public readonly board: (Piece | undefined)[];
    public isBlacksTurn: boolean;
    public doubleMovementPawnIndex: BoardIndex | null;


    public constructor(state: ChessState) {
        this.board = [...state.board];
        this.isBlacksTurn = state.isBlacksTurn;
        this.doubleMovementPawnIndex = state.doubleMovementPawnIndex;
    }


    public getState(): ChessState {
        return new ChessState(
            this.board,
            this.isBlacksTurn,
            this.doubleMovementPawnIndex
        );
    }
}
