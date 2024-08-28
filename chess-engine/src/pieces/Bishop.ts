import { type AddMovesQuery } from "./AddMovesQuery";
import { type CanAttackQuery } from "./CanAttackQuery";
import { diagonalDirections, getInfinityMovePatterns, type MovePattern } from "./MovePattern";
import { Piece, PieceType } from "./Piece";


const patterns: readonly MovePattern[] = getInfinityMovePatterns(diagonalDirections);

/** @sealed */
export class Bishop extends Piece {
    public override get type(): PieceType.Bishop {
        return PieceType.Bishop;
    }


    public override addMoves(query: AddMovesQuery): void {
        query.addBase(patterns);
    }


    public override canAttack(query: CanAttackQuery): boolean {
        return query.getDefault(patterns);
    }


    protected override with(isMoved: boolean): Piece {
        return this.defaultWith(Bishop, isMoved);
    }
}
