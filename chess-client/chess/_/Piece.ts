import { InvalidOperationError } from "@/utils/InvalidOperationError";
import { type BoardIndex } from "../BoardIndex";
import { type BoardCoordinate, getX, getY } from "../BoardCoordinate";
import type { ChessState } from "../ChessState";
import { AttackMove, type Move, MovementMove } from "./Move";
import { getMovePatternIndices, type MovePattern } from "./MovePattern";


export const enum PieceType {
    Pawn,
    Rook,
    Knight,
    Bishop,
    King,
    Queen
}

export abstract class Piece {
    public abstract readonly type: PieceType;

    public readonly id: number;

    private isMovedValue = false; // Is also a brand.
    private isDeletedValue = false;
    private indexValue: BoardIndex;


    public constructor(
        public readonly isBlack: boolean,
        index: BoardIndex,
        public readonly state: ChessState
    ) {
        this.id = state.getNewPieceId();
        state.mutableBoard[this.indexValue = index] = this;
    }


    public get isMoved(): boolean {
        return this.isMovedValue;
    }


    public get isDeleted(): boolean {
        return this.isDeletedValue;
    }


    public get index(): BoardIndex {
        return this.indexValue;
    }


    public get x(): BoardCoordinate {
        return getX(this.index);
    }


    public get y(): BoardCoordinate {
        return getY(this.index);
    }


    public get isCurrentTurn(): boolean {
        return this.state.mutableIsBlacksTurn === this.isBlack;
    }


    public get isSelected(): boolean {
        return !this.isDeleted && this.state.mutableSelectedIndex === this.index;
    }


    public isEnemy(piece: Piece): boolean {
        return this.isBlack !== piece.isBlack;
    }


    public select(): void {
        this.throwIfInvalidInteraction();

        this.setMoves();
        const { state } = this;
        state.mutableSelectedIndex = this.index;
        state.onChange();
    }


    public canMove(): boolean {
        this.throwIfInvalidInteraction();
        return this.state.withSavingMoves(() => this.internalCanMove());
    }


    /** @internal */
    public abstract canAttack(index: BoardIndex): boolean;


    /**
     * @internal
     * @remarks They are not created by setters to minimize the possibility of incorrect
     * assignments from client code.
     * */
    public setIsMoved(value: boolean): void {
        this.isMovedValue = value;
    }


    /** @internal */
    public delete(): void {
        this.isDeletedValue = true;
        const { state } = this;
        state.mutableBoard[this.index] = undefined;
        state.mutableDeletedPieces.push(this);
    }


    /** @internal */
    public restore(): void {
        this.isDeletedValue = false;
        const { state } = this;
        state.mutableBoard[this.index] = this;
        const deletedPieces = state.mutableDeletedPieces;
        deletedPieces.splice(deletedPieces.indexOf(this), 1);
    }


    /** @internal */
    public move(to: BoardIndex): void {
        const board = this.state.mutableBoard;
        board[this.index] = undefined;
        board[this.indexValue = to] = this;
    }


    /** @internal */
    public internalCanMove(): boolean {
        this.setMoves();
        return this.state.mutableMoves.size !== 0;
    }


    protected abstract setMoves(): void;


    protected defaultCanAttack(index: BoardIndex, attackPatterns: Iterable<MovePattern>): boolean {
        const board = this.state.mutableBoard;
        const { x, y } = this;
        for (const pattern of attackPatterns) {
            for (const to of getMovePatternIndices(x, y, pattern)) {
                if (index === to) {
                    return true;
                }
                if (board[to] !== undefined) {
                    break;
                }
            }
        }
        return false;
    }


    protected baseSetMoves(
        movementPatterns: Iterable<MovePattern>,
        attackPatterns = movementPatterns
    ): void {
        const { state } = this;
        const board = state.mutableBoard;
        state.mutableMoves.clear();
        const { x, y } = this;

        for (const pattern of movementPatterns) {
            for (const to of getMovePatternIndices(x, y, pattern)) {
                if (board[to] !== undefined) {
                    break;
                }
                this.trySetMove(MovementMove, to);
            }
        }

        for (const pattern of attackPatterns) {
            for (const to of getMovePatternIndices(x, y, pattern)) {
                const piece = board[to];
                if (piece === undefined) {
                    continue;
                }

                if (this.isEnemy(piece)) {
                    this.trySetMove(AttackMove, to);
                }
                break;
            }
        }
    }


    protected trySetMove(
        Constructor: new (from: BoardIndex, to: BoardIndex, state: ChessState) => Move,
        to: BoardIndex
    ): void {
        const { state } = this;
        const move = new Constructor(this.index, to, state);
        const rollback = move.apply();
        if (!state.isShah()) {
            state.mutableMoves.set(to, move);
        }
        rollback();
    }


    private throwIfInvalidInteraction(): void {
        if (this.isDeleted) {
            throw new InvalidOperationError("Piece is deleted.");
        }
        if (!this.isCurrentTurn) {
            throw new InvalidOperationError("Now it is a different color's turn.");
        }
    }
}
