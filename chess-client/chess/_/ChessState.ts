import { InvalidOperationError } from "@/utils/InvalidOperationError";
import type { BoardIndex } from "../BoardIndex";
import type { Move } from "./moves";
import { AddMovesQuery, CanAttackQuery, type Piece, PieceType } from "./pieces";


declare const brandKey: unique symbol;

export class ChessState {
    declare private readonly [brandKey]: never;


    public constructor(
        public readonly board: readonly (Piece | undefined)[],
        public readonly isBlacksTurn: boolean,
        public readonly doubleMovementPawnIndex: BoardIndex | null
    ) {
    }


    public inCurrentTurn(piece: Piece): boolean {
        return this.isBlacksTurn === piece.isBlack;
    }


    public getMoves(from: BoardIndex): Map<BoardIndex, Move> {
        const piece = this.board[from];
        if (piece === undefined) {
            throw new InvalidOperationError("The piece at the given position is missing.");
        }
        if (!this.inCurrentTurn(piece)) {
            throw new InvalidOperationError("Now it is a different color turn.");
        }

        const query = new AddMovesQuery(from, this);
        piece.addMoves(query);
        return query.moves;
    }


    public isShah(): boolean {
        const kingIndex = this.board.findIndex(piece =>
            piece !== undefined
            && piece.type === PieceType.King
            && this.inCurrentTurn(piece)
        ) as BoardIndex;
        return this.isUnderAttack(kingIndex);
    }


    /** @internal */
    public isUnderAttack(index: BoardIndex): boolean {
        return this.board.some((piece, currentIndex) =>
            piece !== undefined
            && !this.inCurrentTurn(piece)
            && piece.canAttack(new CanAttackQuery(currentIndex as BoardIndex, index, this))
        );
    }
}
