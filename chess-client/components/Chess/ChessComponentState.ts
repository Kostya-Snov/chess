import {
    type ChessState,
    initialChessState,
    type Move,
    type PromotionPieceType
} from "chess-engine";
import { InvalidOperationError, validateNumberArgument } from "chess-utils";


let initialInstance: ChessComponentState;

declare const brandKey: unique symbol;

class ChessComponentState {
    declare private readonly [brandKey]: never;


    static {
        initialInstance = new ChessComponentState([], -1);
    }


    private constructor(
        public readonly history: readonly Move[],
        public readonly historyIndex: number
    ) {
    }


    public get chessState(): ChessState {
        const { historyIndex } = this;
        return historyIndex === -1 ? initialChessState : this.history[historyIndex]!.state;
    }


    public applyMove(move: Move): ChessComponentState {
        if (this.chessState !== move.previousState) {
            throw new InvalidOperationError("The move must be created on the current state.");
        }

        const historyIndex = this.historyIndex + 1;
        const history = this.history.slice(0, historyIndex);
        history.push(move);
        return new ChessComponentState(history, historyIndex);
    }


    public replaceInPromotion(type: PromotionPieceType): ChessComponentState {
        const previousHistory = this.history;
        if (previousHistory.length === 0) {
            throw new InvalidOperationError(
                "Can not replace piece in promotion without moves in the history."
            );
        }

        const history = previousHistory.slice(0, -1);
        const lastMove = previousHistory.at(-1)!;
        history.push({
            ...lastMove,
            state: lastMove.state.replaceInPromotion(type)
        });
        return new ChessComponentState(history, this.historyIndex);
    }


    public setHistoryIndex(index: number): ChessComponentState {
        validateNumberArgument(index, "index")
            .isSafeInteger()
            .isGreaterThanOrEqual(-1);

        const { history } = this;
        if (index >= history.length) {
            throw new InvalidOperationError(
                "The history index must be less than the history length."
            );
        }

        return new ChessComponentState(history, index);
    }
}

export { type ChessComponentState };


export const initialChessComponentState = initialInstance;
