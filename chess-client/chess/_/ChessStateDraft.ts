import { type BoardIndex } from "../BoardIndex";
import { ChessState } from "./ChessState";
import { type Piece } from "./pieces";


export class ChessStateDraft {
    public readonly board: (Piece | undefined)[];
    public readonly deletedPieces: Piece[];
    public isBlacksTurn: boolean;
    public doubleMovementPawnIndex: BoardIndex | null;
    public promotionIndex: BoardIndex | null;


    public constructor(state: ChessState) {
        this.board = [...state.board];
        this.deletedPieces = [...state.deletedPieces];
        this.isBlacksTurn = state.isBlacksTurn;
        this.doubleMovementPawnIndex = state.doubleMovementPawnIndex;
        this.promotionIndex = state.promotionIndex;
    }


    public getState(): ChessState {
        return new ChessState(
            this.board,
            this.deletedPieces,
            this.isBlacksTurn,
            this.doubleMovementPawnIndex,
            this.promotionIndex
        );
    }
}
