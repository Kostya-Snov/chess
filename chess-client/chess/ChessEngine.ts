import { InvalidOperationError } from "@/utils/InvalidOperationError";
import { ArgumentError } from "@/utils/ArgumentError";
import { State } from "./_/State";
import type { MoveHandler } from "./_/MoveHandler";
import type { Rollback } from "./_/Rollback";
import type { BoardIndex } from "./BoardIndex";
import type { Move, MoveType } from "./Move";
import { PieceInfo } from "./PieceInfo";
import { type HistoryItem, HistoryItemType, type MoveHistoryItem } from "./HistoryItem";


class MoveHistoryItemExtended implements MoveHistoryItem {
    public constructor(
        public readonly handler: MoveHandler,
        public readonly rollback: Rollback
    ) {
    }


    public get type(): HistoryItemType.Move {
        return HistoryItemType.Move;
    }


    public get moveType(): MoveType {
        return this.handler.type;
    }


    public get from(): BoardIndex {
        return this.handler.from;
    }


    public get to(): BoardIndex {
        return this.handler.to;
    }
}

type HistoryItemExtended =
    | MoveHistoryItemExtended;


declare const brandKey: unique symbol;

export class ChessEngine {
    declare private readonly [brandKey]: never;


    private readonly _state = new State();
    private readonly _history: HistoryItem[] = [];
    private _historyIndex = -1;
    private _isBlackTurn = false;
    private _moves: ReadonlyMap<BoardIndex, Move> | null = null;
    private _selectedIndex: BoardIndex | null = null;


    public get history(): readonly HistoryItem[] {
        return this._history;
    }


    public get historyIndex(): number {
        return this._historyIndex;
    }


    public set historyIndex(value: number) {
        let historyIndex = this._historyIndex;

        if (value === historyIndex) {
            return;
        }
        if (value < -1) {
            throw new ArgumentError("Must be at least -1.", "historyIndex");
        }
        if (value >= historyIndex) {
            throw new ArgumentError(
                "Must be less than the length of the history.",
                "historyIndex"
            );
        }

        if (value < historyIndex) {
            while (historyIndex !== value) {
                (this._history[historyIndex--] as HistoryItemExtended).rollback(this._state);
            }
        } else {
            while (historyIndex !== value) {
                const item = this._history[historyIndex++]! as HistoryItemExtended;
                switch (item.type) {
                    case HistoryItemType.Move:
                        item.handler.apply(this._state);
                }
            }
        }
        this._historyIndex = historyIndex;
    }


    public get isBlackTurn(): boolean {
        return this._isBlackTurn;
    }


    public get moves(): ReadonlyMap<BoardIndex, Move> | null {
        return this._moves;
    }


    public get selectedIndex(): BoardIndex | null {
        return this._selectedIndex;
    }


    public set selectedIndex(value: BoardIndex | null) {
        if (value === null) {
            this._selectedIndex = this._moves = null;
            return;
        }

        const piece = this._state.board[value];
        if (piece === undefined) {
            throw new InvalidOperationError("There is no piece at the given position.");
        }
        if (piece.isBlack !== this._isBlackTurn) {
            throw new InvalidOperationError("Now it is a different color's turn.");
        }

        this._selectedIndex = value;
        // HACK! 'Map<K, V>' is invariant with respect to the type parameters 'V', but the object
        // returned from 'piece.getMoves' is still safe to cast to 'Map<BoardIndex, Move>', since
        // it is guaranteed not to be used as a 'Map<BoardIndex, MoveHandler>' type.
        this._moves = piece.getMoves(value, this._state);
    }


    public getPiece(index: BoardIndex): PieceInfo | null {
        return this._state.board[index] ?? null;
    }


    public getPieces(): Map<BoardIndex, PieceInfo> {
        const pieces = new Map<BoardIndex, PieceInfo>();
        const { board } = this._state;
        for (let i = 0; i !== board.length; ++i) {
            const piece = board[i]!;
            if (piece !== undefined) {
                pieces.set(i as BoardIndex, piece);
            }
        }
        return pieces;
    }


    public applyMove(to: BoardIndex): void {
        if (this._moves === null) {
            throw new InvalidOperationError("No piece selected.");
        }
        const move = this._moves.get(to);
        if (move === undefined) {
            throw new InvalidOperationError("Move to the specified position is not available.");
        }

        const moveHandler = move as unknown as MoveHandler;
        const rollback = moveHandler.apply(this._state);
        this._isBlackTurn = !this._isBlackTurn;

        const historyItem = new MoveHistoryItemExtended(
            moveHandler,
            state => {
                rollback(state);
                this._isBlackTurn = !this._isBlackTurn;
            }
        );
        this.addHistoryItem(historyItem);

        this._selectedIndex = this._moves = null;
    }


    private addHistoryItem(item: HistoryItemExtended): void {
        this._history.splice(0, ++this._historyIndex);
        this._history.push(item);
    }
}
