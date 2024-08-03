import { type AddMovesQuery } from "./AddMovesQuery";
import { type CanAttackQuery } from "./CanAttackQuery";
import {
    diagonalDirections,
    getInfinityMovePatterns,
    type MovePattern,
    straightDirections
} from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] =
    getInfinityMovePatterns([...straightDirections, ...diagonalDirections]);

/** @sealed */
export class Queen extends Piece {
    public override get type(): PieceType.Queen {
        return PieceType.Queen;
    }


    public override addMoves(query: AddMovesQuery): void {
        query.addBase(patterns);
    }


    public override canAttack(query: CanAttackQuery): boolean {
        return query.getDefault(patterns);
    }


    protected override with(isMoved: boolean): Piece {
        return this.defaultWith(Queen, isMoved);
    }
}
