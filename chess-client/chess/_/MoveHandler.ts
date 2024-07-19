import type { BoardIndex } from "../BoardIndex";
import { MoveType } from "../Move";
import type { State } from "./State";
import type { Rollback } from "./Rollback";


abstract class MoveHandler {
    public abstract readonly type: MoveType;


    public constructor(
        public readonly from: BoardIndex,
        public readonly to: BoardIndex
    ) {
    }


    public abstract apply(state: State): Rollback;
}

export { type MoveHandler };


export class MovementMoveHandler extends MoveHandler {
    /** @sealed */
    public override get type(): MoveType.Movement {
        return MoveType.Movement;
    }


    /** @sealed */
    public override apply(state: State): Rollback {
        const piece = state.board[this.from]!;
        const isMovedBefore = piece.isMoved;
        state.board[this.from] = undefined;
        state.board[this.to] = piece;
        piece.isMoved = true;

        return state => {
            const piece = state.board[this.to]!;
            piece.isMoved = isMovedBefore;
            state.board[this.from] = piece;
        }
    }
}


export class AttackMoveHandler extends MoveHandler {
    /** @sealed */
    public override get type(): MoveType.Attack {
        return MoveType.Attack;
    }


    /** @sealed */
    public override apply(state: State): Rollback {
        const attackingPiece = state.board[this.from]!;
        const isMovedBefore = attackingPiece.isMoved;
        const attackedPiece = state.board[this.to]!;
        state.board[this.from] = undefined;
        state.board[this.to] = attackingPiece;
        attackingPiece.isMoved = true;

        return state => {
            const attackingPiece = state.board[this.to]!;
            attackingPiece.isMoved = isMovedBefore;
            state.board[this.from] = attackingPiece;
            state.board[this.to] = attackedPiece;
        }
    }
}
