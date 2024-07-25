import { InvalidOperationError } from "@/utils/InvalidOperationError";
import { ArgumentError } from "@/utils/ArgumentError";
import { ChessConstants } from "./ChessConstants";
import type { BoardIndex } from "./BoardIndex";
import type { HistoryItem } from "./HistoryItem";
import { type Piece, PieceType } from "./_/Piece";
import { createPiece } from "./_/createPiece";
import type { Move } from "./_/Move";


const enum Constants {
    EmptyRanksLength = 4 * ChessConstants.BoardSize
}

export class ChessState {
    /** @internal */
    public readonly mutableBoard: (Piece | undefined)[] = [];
    /** @internal */
    public readonly mutableDeletedPieces: Piece[] = [];
    /** @internal */
    public mutableIsBlacksTurn = false;
    /** @internal */
    public doubleMovementPawnIndex: BoardIndex | null = null;
    /** @internal */
    public mutableSelectedIndex: BoardIndex | null = null;
    /** @internal */
    public readonly mutableMoves = new Map<BoardIndex, Move>;

    private readonly listeners: (() => void)[] = []; // Is also a brand.
    private readonly historyValue: HistoryItem[] = [];
    private historyIndexValue = -1;


    public constructor() {
        this
            .addFiguresRank(false)
            .addPawnsRank(false)
            .addEmptyRanks()
            .addPawnsRank(true)
            .addFiguresRank(true);
    }


    public get board(): readonly (Piece | undefined)[] {
        return this.mutableBoard;
    }


    public get deletedPieces(): readonly Piece[] {
        return this.mutableDeletedPieces;
    }


    public get isBlacksTurn(): boolean {
        return this.mutableIsBlacksTurn;
    }


    public get selectedIndex(): BoardIndex | null {
        return this.mutableSelectedIndex;
    }


    public get moves(): ReadonlyMap<BoardIndex, Move> {
        return this.mutableMoves;
    }


    public get history(): readonly HistoryItem[] {
        return this.historyValue;
    }


    public get historyIndex(): number {
        return this.historyIndexValue;
    }


    public set historyIndex(value: number) {
        let historyIndex = this.historyIndexValue;
        const history = this.historyValue;

        if (value === historyIndex) {
            return;
        }
        if (!Number.isInteger(value)) {
            throw new ArgumentError("Must be an integer.", "historyIndex");
        }
        if (value < -1) {
            throw new ArgumentError("Must be at least -1.", "historyIndex");
        }
        if (value >= history.length) {
            throw new InvalidOperationError(
                "History index must be less than the length of the history."
            );
        }

        if (value < historyIndex) {
            while (historyIndex !== value) {
                history[historyIndex--]!.rollback();
                this.mutableIsBlacksTurn = !this.mutableIsBlacksTurn;
            }
        } else {
            while (historyIndex !== value) {
                const item = history[++historyIndex]!;
                this.mutableIsBlacksTurn = !this.mutableIsBlacksTurn;
                item.move.apply();
            }
        }
        this.historyIndexValue = historyIndex;

        this.removeSelection();
        this.onChange();
    }


    public get selectedPiece(): Piece | null {
        const selectedIndex = this.mutableSelectedIndex;
        return selectedIndex === null ? null : this.mutableBoard[selectedIndex]!;
    }


    public getNewPieceId(): number {
        return (
            this.mutableBoard.reduce((sum, p) => p === undefined ? sum : sum + 1, 0)
            + this.mutableDeletedPieces.length
        );
    }


    public isShah(): boolean {
        const board = this.mutableBoard;
        const kingIndex = board.findIndex(piece =>
            piece !== undefined
            && piece.isCurrentTurn
            && piece.type === PieceType.King
        ) as BoardIndex;
        return board.some(piece =>
            piece !== undefined
            && !piece.isCurrentTurn
            && piece.canAttack(kingIndex)
        );
    }


    public canMove(): boolean {
        return this.withSavingMoves(() => {
            for (const piece of this.mutableBoard) {
                if (piece !== undefined && piece.isCurrentTurn && piece.internalCanMove()) {
                    return true;
                }
            }
            return false;
        });
    }


    public isMate(): boolean {
        return this.isShah() && !this.canMove();
    }


    public isStalemate(): boolean {
        return !this.canMove() && !this.isShah();
    }


    public deselect(): void {
        this.removeSelection();
        this.onChange();
    }


    public applyMove(to: BoardIndex): void {
        const from = this.mutableSelectedIndex;
        if (from === null) {
            throw new InvalidOperationError("No piece selected.");
        }
        const move = this.mutableMoves.get(to);
        if (move === undefined) {
            throw new InvalidOperationError("Move to the specified position is not available.");
        }

        const rollback = move.apply();
        this.mutableIsBlacksTurn = !this.mutableIsBlacksTurn;
        const history = this.historyValue;
        history.splice(++this.historyIndexValue);
        history.push({ move, rollback });

        this.removeSelection();
        this.onChange();
    }


    public addChangeListener(callback: () => void): void {
        if (!this.listeners.includes(callback)) {
            this.listeners.push(callback);
        }
    }


    public removeChangeListener(callback: () => void): void {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }


    /** @internal */
    public onChange(): void {
        for (const callback of this.listeners) {
            callback();
        }
    }


    /** @internal */
    public withSavingMoves<T>(callback: () => T): T {
        const moves = this.mutableMoves;
        const previousMovesEntries = [...moves.entries()];

        const result = callback();

        moves.clear();
        for (const entry of previousMovesEntries) {
            moves.set(...entry);
        }

        return result;
    }


    private removeSelection(): void {
        this.mutableSelectedIndex = null;
        this.mutableMoves.clear();
    }


    private createPiece(type: PieceType, isBlack: boolean, index: BoardIndex): Piece {
        return createPiece(type, isBlack, index, this);
    }


    private addFiguresRank(isBlack: boolean): this {
        return this
            .addPiece(PieceType.Rook, isBlack)
            .addPiece(PieceType.Knight, isBlack)
            .addPiece(PieceType.Bishop, isBlack)
            .addPiece(PieceType.King, isBlack)
            .addPiece(PieceType.Queen, isBlack)
            .addPiece(PieceType.Bishop, isBlack)
            .addPiece(PieceType.Knight, isBlack)
            .addPiece(PieceType.Rook, isBlack);
    }


    private addPawnsRank(isBlack: boolean): this {
        for (let i = 0; i !== ChessConstants.BoardSize; ++i) {
            this.addPiece(PieceType.Pawn, isBlack);
        }
        return this;
    }


    private addEmptyRanks(): this {
        for (let i = 0; i !== Constants.EmptyRanksLength; ++i) {
            this.mutableBoard.push(undefined);
        }
        return this;
    }


    private addPiece(type: PieceType, isBlack: boolean): this {
        const board = this.mutableBoard;
        const index = board.length as BoardIndex;
        board.push(undefined);
        this.createPiece(type, isBlack, index);
        return this;
    }
}
