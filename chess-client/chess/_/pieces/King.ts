import { type BoardIndex } from "../../BoardIndex";
import { castlingHandlerInstance } from "../moves";
import { type AddMovesQuery } from "./AddMovesQuery";
import { type CanAttackQuery } from "./CanAttackQuery";
import {
    diagonalDirections,
    getOneWayMovePatterns,
    type MovePattern,
    straightDirections
} from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] =
    getOneWayMovePatterns([...straightDirections, ...diagonalDirections]);

/** @sealed */
export class King extends Piece {
    public override get type(): PieceType.King {
        return PieceType.King;
    }


    public override addMoves(query: AddMovesQuery): void {
        query.addBase(patterns);

        const { state } = query;
        if (this.isMoved || state.isUnderAttack(query.from)) {
            return;
        }

        for (const piece of state.board) {
            if (
                piece !== undefined
                && piece.type === PieceType.Rook
                && !piece.isMoved
                && !this.isEnemy(piece)
            ) {
                this.setCastling(piece, query);
            }
        }
    }


    public override canAttack(query: CanAttackQuery): boolean {
        return query.getDefault(patterns);
    }


    protected override with(isMoved: boolean): Piece {
        return this.defaultWith(King, isMoved);
    }


    private setCastling(rook: Piece, query: AddMovesQuery): void {
        const { from, state } = query;
        const { board } = state;

        const rookFrom = board.indexOf(rook) as BoardIndex;
        const direction = rookFrom < from ? -1 : 1;

        for (let i = rookFrom - direction; i !== from; i -= direction) {
            if (board[i] !== undefined) {
                return;
            }
        }

        const rookTo = from + direction as BoardIndex;
        if (state.isUnderAttack(rookTo)) {
            return;
        }

        const kingTo = from + 2 * direction as BoardIndex;
        if (state.isUnderAttack(kingTo)) {
            return;
        }

        query.tryAdd(castlingHandlerInstance, kingTo);
    }
}
