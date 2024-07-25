import { BoardIndex } from "../BoardIndex";
import {
    diagonalDirections,
    getMoveOneWayPatterns,
    type MovePattern,
    straightDirections
} from "./MovePattern";
import { Piece, PieceType } from "./Piece";
import { Move, MoveType, Rollback } from "./Move";


class CastlingMove extends Move {
    /** @sealed */
    public override get type(): MoveType.Castling {
        return MoveType.Castling;
    }


    protected override applyCore(): Rollback {
        const { piece, from, to } = this;
        const [rookFrom, rookTo] = to < from
            ? [to - 1 as BoardIndex, to + 1 as BoardIndex]
            : [to + 2 as BoardIndex, to - 1 as BoardIndex];
        const rook = this.state.mutableBoard[rookFrom]!;

        rook.move(rookTo);
        piece.move(to);
        rook.setIsMoved(true);
        piece.setIsMoved(true);

        return () => {
            piece.setIsMoved(false);
            rook.setIsMoved(false);
            piece.move(from);
            rook.move(rookFrom);
        }
    }
}


const patterns: readonly MovePattern[] =
    getMoveOneWayPatterns([...straightDirections, ...diagonalDirections]);

/** @sealed */
export class King extends Piece {
    public override get type(): PieceType.King {
        return PieceType.King;
    }


    public override canAttack(index: BoardIndex): boolean {
        return this.defaultCanAttack(index, patterns);
    }


    protected override setMoves(): void {
        this.baseSetMoves(patterns);

        const { state } = this;
        if (this.isMoved || state.isUnderAttack(this.index)) {
            return;
        }

        const [leftRook, rightRook] = state.mutableBoard.filter(piece =>
            piece !== undefined
            && piece.type === PieceType.Rook
            && !piece.isMoved
            && !this.isEnemy(piece)
        );

        if (leftRook !== undefined) {
            this.setCastling(leftRook.index, -1);
        }

        if (rightRook !== undefined) {
            this.setCastling(rightRook.index, 1);
        }
    }


    private setCastling(rookIndex: BoardIndex, direction: 1 | -1): void {
        const { state, index } = this;

        for (let i = rookIndex - direction; i !== index; i -= direction) {
            if (state.mutableBoard[i] !== undefined) {
                return;
            }
        }

        const rookTo = index + direction as BoardIndex;
        if (state.isUnderAttack(rookTo)) {
            return;
        }

        const to = index + 2 * direction as BoardIndex;
        if (state.isUnderAttack(to)) {
            return;
        }

        this.trySetMove(CastlingMove, to);
    }
}
